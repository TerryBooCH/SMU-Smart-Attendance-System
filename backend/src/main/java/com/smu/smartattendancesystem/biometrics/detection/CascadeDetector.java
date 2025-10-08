package com.smu.smartattendancesystem.biometrics.detection;

import java.util.*;
import org.opencv.core.*;
import org.opencv.imgproc.Imgproc;
import org.opencv.objdetect.CascadeClassifier;
import org.opencv.objdetect.Objdetect;

import java.nio.file.Path;

public class CascadeDetector extends BaseDetector {
    private Path cascadePath;
    private CascadeClassifier detector;

    public CascadeDetector(String cascadePath) {
        this.cascadePath = basePath.resolve(cascadePath);
        this.detector = new CascadeClassifier(this.cascadePath.toString());
    }

    // CascadeDetectors (LBP, Haar) do not return any scores for the images, so whatever is detected is final 
    public List<DetectionResult> detect(Mat image) {
        ArrayList<DetectionResult> results = new ArrayList<>();

        Mat grayscale = new Mat();
        Imgproc.cvtColor(image, grayscale, Imgproc.COLOR_BGR2GRAY);
        try {
    
            MatOfRect faces = new MatOfRect();
            detector.detectMultiScale(grayscale, faces, 1.1, 3, 0, new Size(30, 30));
    
            for (Rect face : faces.toArray()) {
                DetectionResult result = new DetectionResult(face);
                results.add(result);
            } 
        } finally {
            grayscale.release();
        }
        
        return results;
    };
}
