package com.smu.smartattendancesystem.biometrics.recognition;

import java.util.*;
import org.opencv.core.Mat;

import com.smu.smartattendancesystem.biometrics.metrics.BaseMetric;
import com.smu.smartattendancesystem.models.Student;

public abstract class VectorRecognizer extends BaseRecognizer {
    protected BaseMetric metric;

    public VectorRecognizer(int image_size, BaseMetric metric) {
        super(image_size);
        this.metric = metric;
    }

    public VectorRecognizer(int image_size) {
        super(image_size);
    }

    public RecognitionResult recognizeVectors(Mat face, Map<Student, List<double[]>> dataset) {
        if (metric == null) 
            throw new IllegalStateException("Metric has not been set.");

        double[] vector = transform(face);
        Student bestStudent = null;
        double bestScore = Double.NEGATIVE_INFINITY;

        for (Map.Entry<Student, List<double[]>> entry : dataset.entrySet()) {
            for (double[] sampleVector : entry.getValue()) {
                double score = computeScore(face, sampleVector);
                if (score > bestScore) {
                    bestScore = score;
                    bestStudent = entry.getKey();
                }
            }
        }

        return new RecognitionResult(bestStudent, bestScore);
    }

    public double computeScore(Mat faceA, double[] vectorB) {
        double[] vectorA = transform(faceA);

        return metric.compareVectors(vectorA, vectorB);
    };

    public abstract double[] transform(Mat face);

    public BaseMetric getMetric() {
		return metric;
	}

	public void setMetric(BaseMetric metric) {
		this.metric = metric;
	}

}