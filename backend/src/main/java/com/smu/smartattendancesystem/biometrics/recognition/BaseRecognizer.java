package com.smu.smartattendancesystem.biometrics.recognition;
import java.util.*;
import org.opencv.core.*;

public abstract class BaseRecognizer {
    static { nu.pattern.OpenCV.loadLocally(); }

    // Returns the index of the face has the highest similarity with
    public int recognize(Mat face, List<Mat> dataset, double threshold) {
        List<Double> scores = computeScore(face, dataset);
        int bestIndex = 0;
        for (int i = 1; i < scores.size(); i++) {
            if (scores.get(i) > scores.get(bestIndex)) {
                bestIndex = i;
            }
        }

        return bestIndex;
    }

    public List<Double> computeScore(Mat face, List<Mat> dataset) {
        List<Double> scores = new ArrayList<>();

        for (Mat sample : dataset) {
            scores.add(computeScore(face, sample));
        }
        return scores;
    }

    // The higher the score, the more similar the recognizer thinks the faces are.
    public abstract double computeScore(Mat faceA, Mat faceB);
}
