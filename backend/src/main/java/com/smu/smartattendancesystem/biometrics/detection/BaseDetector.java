package com.smu.smartattendancesystem.biometrics.detection;

import java.util.*;
import org.opencv.core.*;
import java.nio.file.Path;
import java.nio.file.Paths;

public abstract class BaseDetector {
    static { nu.pattern.OpenCV.loadLocally(); }
    protected static final Path basePath = Paths.get(System.getProperty("user.dir"));

    // Filters out bounding boxes with high overlap with higher-confidence boxes 
    public List<DetectionResult> nonMaximumSuppression(List<DetectionResult> candidates, double nmsThreshold) {
        List<DetectionResult> results = new ArrayList<>();
        Collections.sort(candidates);

        for (DetectionResult candidate : candidates) {
            
            boolean keep = true;
            for (DetectionResult kept : results) {
                if (candidate.computeIOU(kept) > nmsThreshold) {
                    keep = false;
                    break;
                }
            }

            if (keep) results.add(candidate);
        }
        
        return results;
    }

    public List<DetectionResult> nonMaximumSuppression(List<DetectionResult> results) {
        return nonMaximumSuppression(results, 0.5);
    }

    public abstract List<DetectionResult> detect(Mat image);
}
