package com.smu.smartattendancesystem.services;

import java.util.*;
import org.opencv.core.*;
import java.io.IOException;

import com.smu.smartattendancesystem.biometrics.detection.*;
import com.smu.smartattendancesystem.biometrics.metrics.*;
import com.smu.smartattendancesystem.biometrics.recognition.*;
import com.smu.smartattendancesystem.biometrics.ImageUtils;
import com.smu.smartattendancesystem.dto.DetectionResultDTO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class BiometricService {
    private final CascadeDetector haarDetector = new CascadeDetector("src/main/resources/weights/haarcascade_frontalface_alt.xml");
    private final CascadeDetector lbpDetector = new CascadeDetector("src/main/resources/weights/lbpcascade_frontalface_improved.xml");
    private final YoloDetector yoloDetector = new YoloDetector("src/main/resources/weights/yolov8n-face.onnx", 640);

    public List<DetectionResultDTO> detect(MultipartFile image, Map<String, String> body) throws IOException {
        String type = body.get("type");

        if (image == null) throw new IllegalArgumentException("No image provided.");

        if (type == null) throw new IllegalArgumentException("Missing 'type' field.");
        type = type.toLowerCase();

        List<String> allowedDetectors = List.of("haar", "lbp", "yolo");
        if (!allowedDetectors.contains(type)) throw new IllegalArgumentException("Invalid detector type. Allowed values: " + allowedDetectors);

        Mat imageMat = ImageUtils.fileToMat(image);
        List<DetectionResult> results;

        switch (type) {
            case "haar":
            results = haarDetector.detect(imageMat);
            break;
        case "lbp":
            results = lbpDetector.detect(imageMat);
            break;
        case "yolo":
            results = yoloDetector.detect(imageMat);
            break;
        default:
            throw new IllegalStateException("Unexpected detector type: " + type);  // should never happen due to above validation check
        }

        return results.stream()
                      .map(DetectionResult::toDTO)
                      .toList();
    }
}