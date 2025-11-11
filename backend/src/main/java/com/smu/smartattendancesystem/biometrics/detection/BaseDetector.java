package com.smu.smartattendancesystem.biometrics.detection;

import java.util.*;
import org.opencv.core.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

@Component
public abstract class BaseDetector {
    static { nu.pattern.OpenCV.loadLocally(); }
    protected static final Path basePath = Paths.get(System.getProperty("user.dir"));

    @Value("${faces.detection.iou_threshold}")
    private double iou_threshold;

    // Filters out bounding boxes with high overlap with higher-confidence boxes 
    public List<DetectionResult> nonMaximumSuppression(List<DetectionResult> candidates, double iou_threshold) {
        List<DetectionResult> results = new ArrayList<>();
        Collections.sort(candidates);

        for (DetectionResult candidate : candidates) {
            
            boolean keep = true;
            for (DetectionResult kept : results) {
                if (candidate.computeIOU(kept) > iou_threshold) {
                    keep = false;
                    break;
                }
            }

            if (keep) results.add(candidate);
        }
        
        return results;
    }

    public List<DetectionResult> nonMaximumSuppression(List<DetectionResult> candidates) {
        return nonMaximumSuppression(candidates, iou_threshold);
    }

    public abstract List<DetectionResult> detect(Mat image);
}
