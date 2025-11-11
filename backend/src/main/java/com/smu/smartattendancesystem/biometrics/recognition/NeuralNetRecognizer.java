package com.smu.smartattendancesystem.biometrics.recognition;

import java.util.*;
import org.opencv.core.*;
import org.opencv.dnn.Dnn;
import org.opencv.dnn.Net;
import org.opencv.imgproc.Imgproc;
import org.opencv.objdetect.CascadeClassifier;

import com.smu.smartattendancesystem.biometrics.metrics.BaseMetric;

import java.nio.file.Path;

public class NeuralNetRecognizer extends BaseRecognizer {
    private Path modelPath;
    private Net model;

    public NeuralNetRecognizer(String modelPath, int image_size, BaseMetric metric) {
        super(image_size, metric);
        this.modelPath = basePath.resolve(modelPath);
        this.model = Dnn.readNetFromONNX(this.modelPath.toString());
    }

    public NeuralNetRecognizer(String modelPath, int image_size) {
        super(image_size);
        this.modelPath = basePath.resolve(modelPath);
        this.model = Dnn.readNetFromONNX(this.modelPath.toString());
    }

    public double[] transform(Mat face) {
        Mat resized = letterbox_resize(face, new Scalar(image_size));
        Mat blob = Dnn.blobFromImage(
            resized,
            1.0 / 255.0,  // normalize image
            new Size(image_size, image_size),
            new Scalar(0, 0, 0),
            true,  // SwapRB (BGR -> RGB)
            false  // Cropping
        );

        model.setInput(blob);
        Mat result = model.forward();  // result is CV_32F type, meaning it can only be converted to a float array
        int size = (int) result.total();

        // Convert Mat to float array
        float[] fvector = new float[size];
        result.get(0, 0, fvector); 

        // Then copy and cast all elements in float array to double
        double[] vector = new double[size];  
        for (int i = 0; i < size; i++) {
            vector[i] = fvector[i];
        }

        return vector;
    }
    
    public double computeScore(Mat faceA, Mat faceB) {
        if (metric == null) throw new IllegalStateException("Metric has not been set.");

        double[] vectorA = transform(faceA);
        double[] vectorB = transform(faceB);

        return metric.compareVectors(vectorA, vectorB);
    }
}
