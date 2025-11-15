package com.smu.smartattendancesystem.biometrics.recognition;
import java.nio.file.*;
import java.util.*;
import org.opencv.core.*;
import org.opencv.imgproc.Imgproc;
import com.smu.smartattendancesystem.biometrics.metrics.*;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.biometrics.detection.DetectionResult;

public abstract class BaseRecognizer {
    static { nu.pattern.OpenCV.loadLocally(); }
    protected static final Path basePath = Paths.get(System.getProperty("user.dir"));
    protected int image_size;

	public BaseRecognizer(int image_size) {
        this.image_size = image_size;
    }

    // Returns the index of the face has the highest similarity with
    public RecognitionResult recognize(Mat face, Map<Student, List<Mat>> dataset) {
        Student bestStudent = null;
        double bestScore = Double.NEGATIVE_INFINITY;

        for (Map.Entry<Student, List<Mat>> entry : dataset.entrySet()) {
            for (Mat sample : entry.getValue()) {
                double score = computeScore(face, sample);
                if (score > bestScore) {
                    bestScore = score;
                    bestStudent = entry.getKey();
                }
            }
        }

        return new RecognitionResult(bestStudent, bestScore);
    }

    // The higher the score, the more similar the recognizer thinks the faces are.
    public abstract double computeScore(Mat faceA, Mat faceB);
}
