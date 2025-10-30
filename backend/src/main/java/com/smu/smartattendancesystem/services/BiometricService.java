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
import com.smu.smartattendancesystem.dto.DetectionResultDTO;
import com.smu.smartattendancesystem.dto.RecognitionResultDTO;
import com.smu.smartattendancesystem.dto.RecognitionResponse;
import com.smu.smartattendancesystem.managers.AttendanceManager;
import com.smu.smartattendancesystem.managers.RosterManager;
import com.smu.smartattendancesystem.managers.SessionManager;
import com.smu.smartattendancesystem.models.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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

    private final Map<String, Set<String>> allowedDetectorRecognizer = Map.of(
        "hist", detectorMap.keySet(),
        "eigen", Set.of("yolo", "mtcnn")
        // "neuralnet", Set.of("yolo", "mtcnn")
    );

    private final Map<String, BaseMetric> metricMap = Map.of(  // Used to tell how similar two face embedding vectors are
        "euclidian", new EuclideanDistance(),
        "cosine", new CosineSimilarity()
    );

    private String rootFaces;
    private final Path basePath = Paths.get(System.getProperty("user.dir"));


    public BiometricService(
        SessionManager sessionManager, 
        RosterManager rosterManager,
        AttendanceManager attendanceManager,
        @Value("${faces.root}") String rootFaces
    ) {
        System.out.println(rootFaces);
        this.sessionManager = sessionManager;
        this.rosterManager = rosterManager;
        this.attendanceManager = attendanceManager;
        this.rootFaces = rootFaces;
    }

    public List<DetectionResultDTO> detect(MultipartFile image, String type) throws IOException {
        if (image == null) throw new IllegalArgumentException("No image provided.");

        if (type == null || type.equals("")) throw new IllegalArgumentException("Missing 'type' field.");
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
        String detector_type,
        String type,
        long session_id, 
        String metric_name,  // Note: Metric has no effect on Histogram recognizers as they do not produce image embedding vectors.
        double threshold
    ) throws IOException {
        if (image == null) throw new IllegalArgumentException("No image provided.");

        // Check detector
        if (detector_type == null || detector_type.equals("")) throw new IllegalArgumentException("Missing 'detector_type' field.");
        detector_type = detector_type.toLowerCase();

        BaseDetector detector = detectorMap.get(detector_type);
        if (detector == null) throw new IllegalArgumentException("Invalid detector type. Allowed values: " + detectorMap.keySet().stream().toList());

        // Check recognizer
        if (type == null || type.equals("")) throw new IllegalArgumentException("Missing 'type' field.");
        type = type.toLowerCase();

        
        BaseRecognizer recognizer = null;
        if (recognizerMap.get(type) != null) {
            recognizer = recognizerMap.get(type);
        } else if (recognizerMap.get(type + "_" + detector_type) != null) {
            recognizer = recognizerMap.get(type + "_" + detector_type);
        } else {
            throw new IllegalArgumentException("Invalid recognizer type. Allowed values: " + validRecognizers);
        }

        if (!allowedDetectorRecognizer.get(type).contains(detector_type)) throw new UnsupportedOperationException(
            String.format("Recognizer '%s' is not compatible with detector '%s'. Allowed detectors for this recognizer: %s", 
                type, detector_type, allowedDetectorRecognizer.get(type)
            )
        );

        // Check session
        Optional<Session> session = this.sessionManager.getSession(session_id);
        if (session.isEmpty()) throw new IllegalArgumentException("Session ID does not exist.");

        Map<String, List<String>> warnings = new LinkedHashMap<>();

        // Link to Roster
        Roster roster = session.get().getRoster();
        List<Student> students = roster.getStudents();

        List<FaceData> faceDataList = students.stream()
            .flatMap(s -> s.getFaceDataList().stream())
            .toList();

        if (faceDataList.isEmpty()) throw new IllegalArgumentException(String.format("No reference images found for recognition (Roster #%d)", roster.getId()));

        BaseMetric metric = metricMap.getOrDefault(metric_name, new CosineSimilarity());
        recognizer.setMetric(metric);


        Map<Student, List<Mat>> dataset = new LinkedHashMap<>(); 
        for (FaceData faceData : faceDataList) {
            Student student = faceData.getStudent();
            Mat face = Imgcodecs.imread(basePath.resolve(this.rootFaces).resolve(faceData.getImagePath()).toString());

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
            results.add(new RecognitionResultDTO(detected.toDTO(), top_student, result.getScore(), Optional.empty()));
        }



        return new RecognitionResponse(warnings, results);
    }
}