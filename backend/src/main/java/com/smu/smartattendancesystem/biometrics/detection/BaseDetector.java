package com.smu.smartattendancesystem.biometrics.detection;

import java.util.ArrayList;
import java.util.Collections;
import org.opencv.core.*;
import java.nio.file.Path;
import java.nio.file.Paths;

public abstract class BaseDetector {
    static { nu.pattern.OpenCV.loadLocally(); }
    protected static final Path basePath = Paths.get(System.getProperty("user.dir"));

    // Filters out bounding boxes with high overlap with higher-confidence boxes 
    public ArrayList<DetectionResult> nonMaximumSuppression(ArrayList<DetectionResult> candidates, double nmsThreshold) {
        ArrayList<DetectionResult> results = new ArrayList<>();
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

    public ArrayList<DetectionResult> nonMaximumSuppression(ArrayList<DetectionResult> results) {
        return nonMaximumSuppression(results, 0.5);
    }

    public abstract ArrayList<DetectionResult> detect(Mat image);
}
