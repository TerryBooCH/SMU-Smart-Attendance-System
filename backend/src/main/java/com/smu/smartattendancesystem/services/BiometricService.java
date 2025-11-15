package com.smu.smartattendancesystem.services;

import java.util.*;
import java.nio.file.*;
import org.opencv.core.*;
import org.opencv.imgcodecs.Imgcodecs;
import java.io.IOException;

import com.smu.smartattendancesystem.biometrics.detection.*;
import com.smu.smartattendancesystem.biometrics.metrics.*;
import com.smu.smartattendancesystem.biometrics.recognition.*;
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

    @Value("${faces.detection.defaultDetector:yolo}")
    private String defaultDetector;

    @Value("${faces.recognition.defaultRecognizer:eigen}")
    private String defaultRecognizer;
    
    @Value("${faces.recognition.defaultMetric:cosine}")
    private String defaultMetric;

    @Value("${faces.recognition.manualThreshold:0.5}")
    private Double defaultManualThreshold;

    @Value("${faces.recognition.autoThreshold:0.8}")
    private Double defaultAutoThreshold;

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
            "hist", detectorMap.keySet(),
            "eigen", Set.of("yolo"),
            "neuralnet", Set.of("yolo")
        );
    }
        
    // Checks if detector type is provided and whether a default value exists in the config
    private String resolveDetectorType(String detector_type) {
        if (detector_type == null || detector_type.isBlank()) {
            if (!detectorMap.containsKey(defaultDetector.toLowerCase())) throw new IllegalArgumentException("Missing 'detector_type' field.");  // If a default value doesnt exist or is invalid, throw an error
            
            detector_type = defaultDetector;
        }
        detector_type = detector_type.toLowerCase();

        return detector_type;
    }

    // Checks if recognizer type is provided and whether a default value exists in the config
    private String resolveRecognizerType(String recognizer_type) {
        if (recognizer_type == null || recognizer_type.isBlank()) {
            if (!validRecognizers.contains(defaultRecognizer.toLowerCase())) throw new IllegalArgumentException("Missing 'type' field.");

            recognizer_type = defaultRecognizer;
        }
        recognizer_type = recognizer_type.toLowerCase();

        return recognizer_type;
    }

    private BaseMetric resolveMetric(String metric_name) {
        if (metric_name == null || metric_name.isEmpty()) {
            if (!metricMap.containsKey(defaultMetric.toLowerCase())) throw new IllegalArgumentException("Missing 'metric' field.");

            metric_name = defaultMetric;
        }
        metric_name = metric_name.toLowerCase();

        BaseMetric metric = metricMap.get(metric_name);
        if (metric == null) throw new IllegalArgumentException("Invalid metric. Allowed values: " + metricMap.keySet().stream().toList());

        return metric;
    }
    
    public List<DetectionResultDTO> detect(
        MultipartFile image, 
        String type
    ) throws IOException {
        if (image == null) throw new IllegalArgumentException("No image provided.");

        Mat imageMat = ImageUtils.fileToMat(image);
        type = resolveDetectorType(type);

        BaseDetector detector = detectorMap.get(type);
        if (detector == null) throw new IllegalArgumentException("Invalid detector type. Allowed values: " + detectorMap.keySet().stream().toList());

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
        autoThreshold = (autoThreshold == null) ? defaultAutoThreshold : autoThreshold;

        if (score > autoThreshold) {
            String status = elapsed.compareTo(lateAfter) <= 0 ? "PRESENT" : "LATE";
            
            return attendanceManager.updateAttendanceStatusBySessionAndStudent(
                session.getId(), student.getId(), status, "AUTO", score
            );
        } else {
            return null;
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
        if (image == null) throw new IllegalArgumentException("No image provided.");
        
        Mat imageMat = ImageUtils.fileToMat(image);
        detector_type = resolveDetectorType(detector_type);
        type = resolveRecognizerType(type);
        BaseMetric metric = resolveMetric(metric_name);
        
        if (!allowedDetectorRecognizer.get(type).contains(detector_type)) throw new UnsupportedOperationException(
            String.format("Recognizer '%s' is not compatible with detector '%s'. Allowed detectors for this recognizer: %s", 
                type, detector_type, allowedDetectorRecognizer.get(type)
            )
        );

        BaseDetector detector = detectorMap.get(detector_type);
        if (detector == null) throw new IllegalArgumentException("Invalid detector type. Allowed values: " + detectorMap.keySet().stream().toList());
        
        BaseRecognizer recognizer = recognizerMap.getOrDefault(
            type,
            recognizerMap.get(type + "_" + detector_type)
        );
        if (recognizer == null) throw new IllegalArgumentException("Invalid recognizer type. Allowed values: " + validRecognizers);
        
        // Check session exists before linking to roster
        Optional<Session> optSession = this.sessionManager.getSession(session_id);
        if (optSession.isEmpty()) throw new IllegalArgumentException("Session ID does not exist.");
        
        Session session = optSession.get();
        Roster roster = session.getRoster();
        List<Student> students = roster.getStudents();

        List<FaceData> faceDataList = getFaceData(roster);

        // Obtain bounding boxes from camera frame
        List<DetectionResult> detectionResults = detector.detect(imageMat);

        // Check if recognizer produces a embedding vector which is used for recognition
        if (recognizer instanceof VectorRecognizer) {
            VectorRecognizer vectorRecognizer = (VectorRecognizer) recognizer;
            vectorRecognizer.setMetric(metric);

            // Loop through each facedata and check if a embedding has already been computed for the corresponding facedata
            // If it has, skip the computation and add the saved embedding
            // If not, compute the embedding and save it to the database so it does not have to be recomputed in the future. 
            Map<Student, List<double[]>> embeddings = new HashMap<>();

            for (FaceData faceData : faceDataList) {
                Optional<Embedding> optEmbedding = embeddingRepository.findByDetectorAndRecognizerAndFaceDataId(detector_type, type, faceData.getId());
                Embedding embedding;

                if (optEmbedding.isPresent()) {
                    embedding = optEmbedding.get();
                } else {
                    // Try to read from the image at the specified path
                    Mat face = Imgcodecs.imread(basePath.resolve(root).resolve(faceData.getImagePath()).toString());
                    if (face.empty()) continue;

                    // Obtain all detections and obtain the best one based on score and area
                    List<DetectionResult> detections = detector.detect(face);
                    Optional<DetectionResult> bestDetection = detections.stream()
                        .max(Comparator.naturalOrder());

                    if (bestDetection.isEmpty()) continue;
                    Mat cropped = ImageUtils.crop(bestDetection.get(), face);

                    // Convert the cropped image into a embedding vector
                    double[] vector = vectorRecognizer.transform(cropped);
                    
                    // Save to the DB if it doesnt exist yet
                    embedding = new Embedding(detector_type, type, faceData, vector);
                    embeddingRepository.save(embedding);
                }

                embeddings.computeIfAbsent(faceData.getStudent(), s -> new ArrayList<>())
                    .add(embedding.getVector());
            }

            List<RecognitionResultDTO> results = new ArrayList<>();
            for (DetectionResult detected : detectionResults) {
                Mat query = ImageUtils.crop(detected, imageMat);

                RecognitionResult result = vectorRecognizer.recognizeVectors(query, embeddings);
                Student top_student = result.getStudent();
                double score = result.getScore();

                // Attendance can be null if no attendance was updated; confidence below threshold.
                Attendance attendance = updateAttendance(session, top_student, score, manualThreshold, autoThreshold);  
                results.add(new RecognitionResultDTO(detected.toDTO(), convertToDTO(top_student), result.getScore(), convertToDTO(attendance)));
            }

            return new RecognitionResponse(warnings, results);


        } else {  // Recognizer does not produce vectors, eg. HistogramRecognizer
            Map<Student, List<Mat>> dataset = new HashMap<>();

            for (FaceData faceData : faceDataList) {
                Mat face = Imgcodecs.imread(basePath.resolve(root).resolve(faceData.getImagePath()).toString());
                if (face.empty()) continue;

                // Obtain all detections and obtain the best one based on score and area
                List<DetectionResult> detections = detector.detect(face);
                Optional<DetectionResult> bestDetection = detections.stream()
                    .max(Comparator.naturalOrder());

                if (bestDetection.isEmpty()) continue;
                Mat cropped = ImageUtils.crop(bestDetection.get(), face);

                dataset.computeIfAbsent(faceData.getStudent(), s -> new ArrayList<>())
                    .add(cropped);
            }

            List<RecognitionResultDTO> results = new ArrayList<>();
            for (DetectionResult detected : detectionResults) {
                Mat query = ImageUtils.crop(detected, imageMat);

                RecognitionResult result = recognizer.recognize(query, dataset);
                Student top_student = result.getStudent();
                double score = result.getScore();

                // Attendance can be null if no attendance was updated; confidence below threshold.
                Attendance attendance = updateAttendance(session, top_student, score, manualThreshold, autoThreshold);  
                results.add(new RecognitionResultDTO(detected.toDTO(), convertToDTO(top_student), result.getScore(), convertToDTO(attendance)));
            }

            return new RecognitionResponse(warnings, results);
        }


        // Check if any students do not have any reference images to compare against for recognition in the dataset
        // for (Student student : students) {
        //     if (dataset.containsKey(student)) continue;
            
        //     warnings.computeIfAbsent(
        //         "no_ref_face", 
        //         k -> new ArrayList<>()
        //     ).add(
        //         String.format("Student #%d: %s", student.getId(), student.getName())
        //     );
        // }
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
    
    public void setDefaultDetector(String defaultDetector) {
        this.defaultDetector = defaultDetector;
    }

    public void setDefaultRecognizer(String defaultRecognizer) {
        this.defaultRecognizer = defaultRecognizer;
    }

    public void setDefaultMetric(String defaultMetric) {
        this.defaultMetric = defaultMetric;
    }

    public void setDefaultManualThreshold(Double defaultManualThreshold) {
        this.defaultManualThreshold = defaultManualThreshold;
    }

    public void setDefaultAutoThreshold(Double defaultAutoThreshold) {
        this.defaultAutoThreshold = defaultAutoThreshold;
    }
}