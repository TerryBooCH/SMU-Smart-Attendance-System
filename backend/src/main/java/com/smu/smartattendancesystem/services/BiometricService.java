package com.smu.smartattendancesystem.services;

import java.util.*;
import java.nio.file.*;
import org.opencv.core.*;
import org.opencv.imgcodecs.Imgcodecs;
import java.io.IOException;

import com.smu.smartattendancesystem.biometrics.detection.*;
import com.smu.smartattendancesystem.biometrics.metrics.*;
import com.smu.smartattendancesystem.biometrics.recognition.*;
import com.smu.smartattendancesystem.controllers.ConfigController;
import com.smu.smartattendancesystem.biometrics.ImageUtils;
import com.smu.smartattendancesystem.dto.AttendanceDTO;
import com.smu.smartattendancesystem.dto.DetectionResultDTO;
import com.smu.smartattendancesystem.dto.RecognitionResultDTO;
import com.smu.smartattendancesystem.dto.StudentDTO;
import com.smu.smartattendancesystem.dto.RecognitionResponse;
import com.smu.smartattendancesystem.managers.AttendanceManager;
import com.smu.smartattendancesystem.managers.RosterManager;
import com.smu.smartattendancesystem.managers.SessionManager;
import com.smu.smartattendancesystem.models.*;
import com.smu.smartattendancesystem.repositories.AttendanceRepository;
import com.smu.smartattendancesystem.repositories.EmbeddingRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.mock.web.MockMultipartFile;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class BiometricService {
    private final SessionManager sessionManager;
    private final RosterManager rosterManager;
    private final AttendanceManager attendanceManager;
    private final AttendanceRepository attendanceRepository;
    private final EmbeddingRepository embeddingRepository;

    private final Map<String, BaseDetector> detectorMap = Map.of(
        "haar", new CascadeDetector("src/main/resources/weights/haarcascade_frontalface_alt.xml"),
        "lbp", new CascadeDetector("src/main/resources/weights/lbpcascade_frontalface_improved.xml"),
        "yolo", new YoloDetector("src/main/resources/weights/yolov8n-face.onnx", 640)
    );

    private final Set<String> validRecognizers = Set.of("hist", "eigen", "neuralnet");
    private final Map<String, BaseRecognizer> recognizerMap = Map.of(
        "hist", new HistogramRecognizer(128),
        "eigen_yolo", EigenFaceRecognizer.fromConfig("src/main/resources/weights/yolo_eigenface.config"),
        "neuralnet_yolo", new NeuralNetRecognizer("src/main/resources/weights/yolo_NN_recognizer.onnx", 128)
    );

    private final Map<String, Set<String>> allowedDetectorRecognizer;

    private final Map<String, BaseMetric> metricMap = Map.of(  // Used to tell how similar two face embedding vectors are
        "euclidian", new EuclideanDistance(),
        "cosine", new CosineSimilarity()
    );

    @Value("${faces.root}")
    private String root;

    @Value("${faces.recognition.defaultMetric:cosine}")
    private String defaultMetric;

    @Value("${faces.recognition.manualThreshold:0.5}")
    private Double defaultManualThreshold;

    private Double getCurrentAutoThreshold() {
        return ConfigController.getCurrentRecognitionThreshold();
    }

    private String getCurrentDefaultDetector() {
        return ConfigController.getCurrentDefaultDetector();
    }

    private String getCurrentDefaultRecognizer() {
        return ConfigController.getCurrentDefaultRecognizer();
    }

    private final Path basePath = Paths.get(System.getProperty("user.dir"));
    
    public BiometricService(
        SessionManager sessionManager, 
        RosterManager rosterManager,
        AttendanceManager attendanceManager,
        AttendanceRepository attendanceRepository,
        EmbeddingRepository embeddingRepository
    ) {
        this.sessionManager = sessionManager;
        this.rosterManager = rosterManager;
        this.attendanceManager = attendanceManager;
        this.attendanceRepository = attendanceRepository;
        this.embeddingRepository = embeddingRepository;

        this.allowedDetectorRecognizer = Map.of(
            "hist", detectorMap.keySet(),  // hist works with all detectors
            "eigen", Set.of("yolo"),       // eigen only works with yolo
            "neuralnet", Set.of("yolo")    // neuralnet only works with yolo
        );
    }
        
    // Checks if detector type is provided and whether a default value exists in the config
    private String resolveDetectorType(String detector_type) {
        if (detector_type == null || detector_type.isBlank()) {
            detector_type = getCurrentDefaultDetector();
        }
        detector_type = detector_type.toLowerCase();
        
        if (!detectorMap.containsKey(detector_type)) {
            throw new IllegalArgumentException("Invalid detector type. Allowed values: " + detectorMap.keySet());
        }
        
        return detector_type;
    }

    // Checks if recognizer type is provided and whether a default value exists in the config
    private String resolveRecognizerType(String recognizer_type) {
        if (recognizer_type == null || recognizer_type.isBlank()) {
            recognizer_type = getCurrentDefaultRecognizer();
        }
        recognizer_type = recognizer_type.toLowerCase();

        if (!validRecognizers.contains(recognizer_type)) {
            throw new IllegalArgumentException("Invalid recognizer type. Allowed values: " + validRecognizers);
        }

        return recognizer_type;
    }

    // Validates detector-recognizer compatibility
    private void validateDetectorRecognizerCompatibility(String detector_type, String recognizer_type) {
        Set<String> allowedDetectors = allowedDetectorRecognizer.get(recognizer_type);
        if (allowedDetectors == null || !allowedDetectors.contains(detector_type)) {
            throw new UnsupportedOperationException(
                String.format("Recognizer '%s' is not compatible with detector '%s'. Allowed detectors for this recognizer: %s", 
                    recognizer_type, detector_type, allowedDetectorRecognizer.get(recognizer_type)
                )
            );
        }
    }

    private BaseMetric resolveMetric(String metric_name) {
        if (metric_name == null || metric_name.isEmpty()) {
            if (!metricMap.containsKey(defaultMetric.toLowerCase())) {
                throw new IllegalArgumentException("Missing 'metric' field.");
            }
            metric_name = defaultMetric;
        }
        metric_name = metric_name.toLowerCase();

        BaseMetric metric = metricMap.get(metric_name);
        if (metric == null) {
            throw new IllegalArgumentException("Invalid metric. Allowed values: " + metricMap.keySet().stream().toList());
        }

        return metric;
    }
    
    public List<DetectionResultDTO> detect(
        MultipartFile image, 
        String type
    ) throws IOException {
        if (image == null) {
            throw new IllegalArgumentException("No image provided.");
        }

        Mat imageMat = ImageUtils.fileToMat(image);
        type = resolveDetectorType(type);

        BaseDetector detector = detectorMap.get(type);
        if (detector == null) {
            throw new IllegalArgumentException("Invalid detector type. Allowed values: " + detectorMap.keySet().stream().toList());
        }

        List<DetectionResult> results = detector.detect(imageMat);

        return results.stream()
                      .map(DetectionResult::toDTO)
                      .toList();
    }

    public List<DetectionResultDTO> detect(
        byte[] imageBytes,
        String type
    ) throws IOException {
        // Convert byte[] to MultipartFile using MockMultipartFile
        MultipartFile multipartFile = new MockMultipartFile(
            "image", "image.jpg", "image/jpeg", imageBytes
        );

        return this.detect(multipartFile, type);
    }

    // Given a roster, return the facedata of all students associated with that roster
    private List<FaceData> getFaceData(Roster roster) {
        List<Student> students = roster.getStudents();

        List<FaceData> faceDataList = students.stream()
            .flatMap(s -> s.getFaceDataList().stream())
            .toList();

        if (faceDataList.isEmpty()) throw new IllegalArgumentException(String.format("No reference images found for recognition (Roster #%d)", roster.getId()));

        return faceDataList;
    } 


    // Returns null if attendance was not updated.
    private Attendance updateAttendance(Session session, Student student, double score, Double manualThreshold, Double autoThreshold) {
        Duration lateAfter = Duration.ofMinutes(session.getLateAfterMinutes());
        Duration elapsed = Duration.between(session.getStartAt(), LocalDateTime.now());

        manualThreshold = (manualThreshold == null) ? defaultManualThreshold : manualThreshold;
        // Use the dynamic method instead of the field
        autoThreshold = (autoThreshold == null) ? getCurrentAutoThreshold() : autoThreshold;

        if (score > autoThreshold) {
            String status = elapsed.compareTo(lateAfter) <= 0 ? "PRESENT" : "LATE";
            
            return attendanceManager.updateAttendanceStatusBySessionAndStudent(
                session.getId(), student.getId(), status, "AUTO", score
            );
        } else {
            return null;
        }

    }

    private Optional<Mat> loadBestCrop(FaceData faceData, BaseDetector detector) {
        String path = basePath.resolve(root).resolve(faceData.getImagePath()).toString();
        Mat img = Imgcodecs.imread(path);
        if (img.empty()) return Optional.empty();

        return detector.detect(img).stream()
            .max(Comparator.naturalOrder()) // best detection
            .map(det -> ImageUtils.crop(det, img));
    }

    // Build dataset for non-vector recognizers
    private Map<Student, List<Mat>> buildImageDataset(List<FaceData> faceDataList, BaseDetector detector) {
        Map<Student, List<Mat>> dataset = new HashMap<>();

        for (FaceData fd : faceDataList) {
            loadBestCrop(fd, detector).ifPresent(crop ->
                dataset.computeIfAbsent(fd.getStudent(), s -> new ArrayList<>())
                    .add(crop)
            );
        }
        return dataset;
    }

    // Build dataset for vector recognizers (including DB caching)
    private Map<Student, List<double[]>> buildVectorDataset(
        List<FaceData> faceDataList,
        String detectorType,
        String recognizerType,
        BaseDetector detector,
        VectorRecognizer recognizer
    ) {
        Map<Student, List<double[]>> dataset = new HashMap<>();

        // Loop through each facedata and check if a embedding has already been computed for the corresponding facedata
        // If it has, skip the computation and add the saved embedding
        // If not, compute the embedding and save it to the database so it does not have to be recomputed in the future. 
        for (FaceData fd : faceDataList) {
            Optional<Embedding> optEmbedding = embeddingRepository.findByDetectorAndRecognizerAndFaceData(detectorType, recognizerType, fd);

            double[] embedding;

            if (optEmbedding.isPresent()) {
                embedding = optEmbedding.get().getVector();
            } else {
                // Compute + save
                Optional<Mat> cropOpt = loadBestCrop(fd, detector);
                if (cropOpt.isEmpty()) continue;

                embedding = recognizer.transform(cropOpt.get());
                embeddingRepository.save(new Embedding(detectorType, recognizerType, fd, embedding));
            }

            dataset.computeIfAbsent(fd.getStudent(), s -> new ArrayList<>()).add(embedding);
        }

        return dataset;
    }

    private void addMissingReferenceWarnings(
        Map<String, List<String>> warnings,
        List<Student> students,
        Map<Student, ?> dataset
    ) {
        for (Student student : students) {
            if (!dataset.containsKey(student)) {
                warnings.computeIfAbsent("no_ref_face", k -> new ArrayList<>())
                    .add(String.format("Student #%d: %s", student.getId(), student.getName()));
            }
        }
    }

    public RecognitionResponse recognize(
        MultipartFile image,
        long session_id, 
        String detector_type,
        String type,
        String metric_name,  // Note: Metric has no effect on Histogram recognizers as they do not produce image embedding vectors.
        Double manualThreshold,
        Double autoThreshold
    ) throws IOException {
        Map<String, List<String>> warnings = new LinkedHashMap<>();
        if (image == null) {
            throw new IllegalArgumentException("No image provided.");
        }
        
        Mat imageMat = ImageUtils.fileToMat(image);
        detector_type = resolveDetectorType(detector_type);
        type = resolveRecognizerType(type);
        
        // Validate detector-recognizer compatibility
        validateDetectorRecognizerCompatibility(detector_type, type);
        
        BaseMetric metric = resolveMetric(metric_name);
        BaseDetector detector = detectorMap.get(detector_type);
        
        if (detector == null) {
            throw new IllegalArgumentException("Invalid detector type. Allowed values: " + detectorMap.keySet().stream().toList());
        }
        
        BaseRecognizer recognizer = recognizerMap.getOrDefault(
            type,
            recognizerMap.get(type + "_" + detector_type)
        );
        if (recognizer == null) throw new IllegalArgumentException("Invalid recognizer type. Allowed values: " + validRecognizers);
        
        // Check session exists before linking to roster
        Optional<Session> optSession = this.sessionManager.getSession(session_id);
        if (optSession.isEmpty()) {
            throw new IllegalArgumentException("Session ID does not exist.");
        }
        
        Session session = optSession.get();
        Roster roster = session.getRoster();
        List<Student> students = roster.getStudents();

        List<FaceData> faceDataList = getFaceData(roster);

        // Obtain bounding boxes from camera frame
        List<DetectionResult> detectionResults = detector.detect(imageMat);

        List<RecognitionResultDTO> results = new ArrayList<>();

        // Check if recognizer produces a embedding vector which is used for recognition. Eg. EigenFace/NeuralNet
        if (recognizer instanceof VectorRecognizer vectorRecognizer) {
            vectorRecognizer.setMetric(metric);

            Map<Student, List<double[]>> vectors = buildVectorDataset(faceDataList, detector_type, type, detector, vectorRecognizer);

            for (DetectionResult det : detectionResults) {
                Mat query = ImageUtils.crop(det, imageMat);
                RecognitionResult result = vectorRecognizer.recognizeVectors(query, vectors);
                Student best = result.getStudent();
                double score = result.getScore();

                Attendance att = updateAttendance(session, best, score, manualThreshold, autoThreshold);
                results.add(new RecognitionResultDTO(det.toDTO(), convertToDTO(best), score, convertToDTO(att)));
            }
            addMissingReferenceWarnings(warnings, students, vectors);
        } else {  // Recognizer does not produce a embedding vector. Eg. HistogramRecognizer
            Map<Student, List<Mat>> dataset = buildImageDataset(faceDataList, detector);

            for (DetectionResult det : detectionResults) {
                Mat query = ImageUtils.crop(det, imageMat);
                RecognitionResult result = recognizer.recognize(query, dataset);
                Student best = result.getStudent();
                double score = result.getScore();

                Attendance att = updateAttendance(session, best, score, manualThreshold, autoThreshold);
                results.add(new RecognitionResultDTO(det.toDTO(), convertToDTO(best), score, convertToDTO(att)));
            }
            addMissingReferenceWarnings(warnings, students, dataset);
        }

        return new RecognitionResponse(warnings, results);
    }

    // Alternative overloaded method that takes in a byte array instead of a multipartfile
    @Transactional
    public RecognitionResponse recognize(
        byte[] imageBytes,
        long session_id,
        String detector_type,
        String type,
        String metric_name,
        Double manualThreshold,
        Double autoThreshold
    ) throws IOException {
        // Convert byte[] to MultipartFile using MockMultipartFile
        MultipartFile multipartFile = new MockMultipartFile(
            "image", "image.jpg", "image/jpeg", imageBytes
        );

        return recognize(multipartFile, session_id, detector_type, type, metric_name, manualThreshold, autoThreshold);
    }

    private StudentDTO convertToDTO(Student student) {
        if (student == null) return null;

        return new StudentDTO(
                student.getStudentId(),
                student.getName(),
                student.getEmail(),
                student.getPhone(),
                student.getClassName()
        );
    }

    private AttendanceDTO convertToDTO(Attendance attendance) {
        if (attendance == null) return null;

        return new AttendanceDTO(
                attendance.getId(),
                attendance.getCreatedAt(),
                attendance.getUpdatedAt(),
                attendance.getStatus(),
                attendance.getMethod(),
                attendance.getConfidence(),
                attendance.getTimestamp(),
                attendance.getStudent().getId(),
                attendance.getStudent().getStudentId(),
                attendance.getStudent().getName(),
                attendance.getStudent().getEmail(),
                attendance.getStudent().getPhone(),
                attendance.getStudent().getClassName(),
                attendance.getSession().getId(),
                attendance.getSession().getCourseName(),
                attendance.getSession().isOpen()
        );
    }
    
    public void setDefaultMetric(String defaultMetric) {
        this.defaultMetric = defaultMetric;
    }

    public void setDefaultManualThreshold(Double defaultManualThreshold) {
        this.defaultManualThreshold = defaultManualThreshold;
    }
}