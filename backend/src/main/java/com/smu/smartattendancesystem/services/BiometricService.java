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
import com.smu.smartattendancesystem.dto.RecognitionResponse;
import com.smu.smartattendancesystem.managers.AttendanceManager;
import com.smu.smartattendancesystem.managers.RosterManager;
import com.smu.smartattendancesystem.managers.SessionManager;
import com.smu.smartattendancesystem.models.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class BiometricService {
    private final SessionManager sessionManager;
    private final RosterManager rosterManager;
    private final AttendanceManager attendanceManager;

    private final Map<String, BaseDetector> detectorMap = Map.of(
        "haar", new CascadeDetector("src/main/resources/weights/haarcascade_frontalface_alt.xml"),
        "lbp", new CascadeDetector("src/main/resources/weights/lbpcascade_frontalface_improved.xml"),
        "yolo", new YoloDetector("src/main/resources/weights/yolov8n-face.onnx", 640)
        // "mtcnn", new YoloDetector(...)
    );

    private final Set<String> validRecognizers = Set.of("hist", "eigen");
    private final Map<String, BaseRecognizer> recognizerMap = Map.of(
        "hist", new HistogramRecognizer(128),
        "eigen_yolo", EigenFaceRecognizer.fromConfig("src/main/resources/weights/yolo_eigenface.config"),
        "eigen_mtcnn", EigenFaceRecognizer.fromConfig("src/main/resources/weights/mtcnn_eigenface.config")
        // "neuralnet_yolo", new NeuralNetRecognizer(...)
        // "neuralnet_mtcnn", new NeuralNetRecognizer(...)
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

    @Value("${faces.recognition.manualThreshold:0.4}")
    private Double manualThreshold;

    @Value("${faces.recognition.autoMarkThreshold:0.7}")
    private Double autoMarkThreshold;

    private final Path basePath = Paths.get(System.getProperty("user.dir"));
    public BiometricService(
        SessionManager sessionManager, 
        RosterManager rosterManager,
        AttendanceManager attendanceManager
    ) {
        this.sessionManager = sessionManager;
        this.rosterManager = rosterManager;
        this.attendanceManager = attendanceManager;
        this.allowedDetectorRecognizer = Map.of(
            "hist", detectorMap.keySet(),
            "eigen", Set.of("yolo", "mtcnn")
            // "neuralnet", Set.of("yolo", "mtcnn")
        );
        
    }

    public List<DetectionResultDTO> detect(
        MultipartFile image, 
        String type
    ) throws IOException {
        if (image == null) throw new IllegalArgumentException("No image provided.");

        type = (type == null || type.isEmpty()) ? defaultDetector : type;
        type = type.toLowerCase();

        BaseDetector detector = detectorMap.get(type.toLowerCase());
        if (detector == null) throw new IllegalArgumentException("Invalid detector type. Allowed values: " + detectorMap.keySet().stream().toList());

        Mat imageMat = ImageUtils.fileToMat(image);
        List<DetectionResult> results = detector.detect(imageMat);

        return results.stream()
                      .map(DetectionResult::toDTO)
                      .toList();
    }

    public RecognitionResponse recognize(
        MultipartFile image,
        long session_id, 
        String detector_type,
        String type,
        String metric_name,  // Note: Metric has no effect on Histogram recognizers as they do not produce image embedding vectors.
        Double threshold
    ) throws IOException {
        if (image == null) throw new IllegalArgumentException("No image provided.");

        // Check detector
        if (detector_type == null || detector_type.isBlank()) {
            if (defaultDetector != null && detectorMap.containsKey(defaultDetector.toLowerCase())) {
                detector_type = defaultDetector;
            } else {
                throw new IllegalArgumentException("Missing 'detector_type' field.");
            }
        }
        detector_type = detector_type.toLowerCase();

        BaseDetector detector = detectorMap.get(detector_type);
        if (detector == null) throw new IllegalArgumentException("Invalid detector type. Allowed values: " + detectorMap.keySet().stream().toList());

        // Check recognizer
        if (type == null || type.isBlank()) {
            if (defaultRecognizer != null && recognizerMap.containsKey(defaultRecognizer.toLowerCase())) {
                type = defaultRecognizer;
            } else {
                throw new IllegalArgumentException("Missing 'type' field.");
            }
        }
        type = type.toLowerCase();
        
        if (!allowedDetectorRecognizer.get(type).contains(detector_type)) throw new UnsupportedOperationException(
            String.format("Recognizer '%s' is not compatible with detector '%s'. Allowed detectors for this recognizer: %s", 
                type, detector_type, allowedDetectorRecognizer.get(type)
            )
        );

        BaseRecognizer recognizer = null;
        if (recognizerMap.containsKey(type)) {
            recognizer = recognizerMap.get(type);
        } else if (recognizerMap.containsKey(type + "_" + detector_type)) {
            recognizer = recognizerMap.get(type + "_" + detector_type);
        } else {
            throw new IllegalArgumentException("Invalid recognizer type. Allowed values: " + validRecognizers);
        }

        // Check metric
        metric_name = (metric_name != null) ? metric_name : defaultMetric;
        BaseMetric metric = metricMap.getOrDefault(metric_name, new CosineSimilarity());
        recognizer.setMetric(metric);

        // Check threshold
        threshold = (threshold != null) ? threshold : autoMarkThreshold;

        // Check session
        Optional<Session> optSession = this.sessionManager.getSession(session_id);
        if (optSession.isEmpty()) throw new IllegalArgumentException("Session ID does not exist.");

        Session session = optSession.get();

        Map<String, List<String>> warnings = new LinkedHashMap<>();

        // Link to Roster
        Roster roster = session.getRoster();
        List<Student> students = roster.getStudents();

        List<FaceData> faceDataList = students.stream()
            .flatMap(s -> s.getFaceDataList().stream())
            .toList();

        if (faceDataList.isEmpty()) throw new IllegalArgumentException(String.format("No reference images found for recognition (Roster #%d)", roster.getId()));

        Map<Student, List<Mat>> dataset = new LinkedHashMap<>(); 
        for (FaceData faceData : faceDataList) {
            Student student = faceData.getStudent();
            Mat face = Imgcodecs.imread(basePath.resolve(this.root).resolve(faceData.getImagePath()).toString());

            if (face.empty()) continue;

            // Obtain all detections and obtain the best one based on score and area
            List<DetectionResult> detections = detector.detect(face);
            Optional<DetectionResult> bestDetection = detections.stream()
                .max(Comparator.naturalOrder());

            if (bestDetection.isEmpty()) continue;

            Mat cropped;
            if (detector_type.toLowerCase() == "mtcnn") {
                // TODO, align face on landmarks
                // ImageUtils.crop_and_align(bestDetection, face);
                throw new UnsupportedOperationException("Not implemented yet.");
            } else {
                cropped = ImageUtils.crop(bestDetection.get(), face);
            }

            // Check if the student exists in the hashmap, if not, add them to the array list
            if (dataset.get(student) == null) {
                dataset.put(student, new ArrayList<>());
            }

            dataset.get(student).add(cropped);
        }

        // Check if any students do not have any reference images to compare against for recognition in the dataset
        for (Student student : students) {
            if (dataset.get(student) != null) continue;
            
            if (warnings.get("no_ref_face") == null) warnings.put("no_ref_face", new ArrayList<String>());
            warnings.get("no_ref_face").add(String.format("Student #%d: %s", student.getId(), student.getName()));
        }


        Mat imageMat = ImageUtils.fileToMat(image);
        List<DetectionResult> detectionResults = detector.detect(imageMat);
        dataset.values();

        // Loop through each detection result and pass the cropped image to the recognizer. 
        List<RecognitionResultDTO> results = new ArrayList<>();
        for (DetectionResult detected : detectionResults) {
            Mat queryFace;
            if (detector_type.toLowerCase() == "mtcnn") {
                // queryFace = ImageUtils.crop_and_align(detected, imageMat);
                throw new UnsupportedOperationException("Not implemented yet.");  // TODO
            } else {
                queryFace = ImageUtils.crop(detected, imageMat);
            }

            System.out.println(dataset.values().stream()
                    .flatMap(List::stream)
                    .toList());

            RecognitionResult result = recognizer.recognize(
                queryFace,
                dataset.values().stream()
                    .flatMap(List::stream)
                    .toList()
            );

            // Obtain top student from index
            Student top_student = null;
            int index = result.getIndex();
            for (Map.Entry<Student, List<Mat>> entry : dataset.entrySet()) {
                int size = entry.getValue().size();
                if (index < size) {
                    top_student = entry.getKey();
                    break;
                }
                index -= size;
            }


            // TODO: Link to attendance
            // If lower than required threshold, dont mark attendance, return status manual
            // Mark as late if after `late_after_minutes`
            // Mark as present if before
            Duration lateAfter = Duration.ofMinutes(session.getLateAfterMinutes());
            Duration duration = Duration.between(session.getStartAt(), LocalDateTime.now());

            String status;
            String method;
            Attendance attendance;
            if (result.getScore() < manualThreshold) {
                status = "PENDING";
                method = "NOT MARKED";
            } else if (result.getScore() < manualThreshold) {
                status = "PENDING";
                method = "MANUAL";
            } else {
                status = duration.compareTo(lateAfter) <= 0 ? "LATE" : "PRESENT";
                method = "AUTO";
            }
            attendance = attendanceManager.updateAttendanceStatusBySessionAndStudent(session_id, top_student.getId(), status, method, result.getScore());

            results.add(new RecognitionResultDTO(detected.toDTO(), top_student, result.getScore(), convertToDTO(attendance)));
        }

        return new RecognitionResponse(warnings, results);
    }

    private AttendanceDTO convertToDTO(Attendance attendance) {
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

    public void setAutoMarkThreshold(Double autoMarkThreshold) {
        this.autoMarkThreshold = autoMarkThreshold;
    }
}