package com.smu.smartattendancesystem.biometrics.detection;

import java.util.ArrayList;
import java.util.List;
import java.nio.file.Path;
import java.util.AbstractMap.SimpleEntry;

import org.opencv.core.*;
import org.opencv.dnn.Dnn;
import org.opencv.dnn.Net;
import org.opencv.objdetect.CascadeClassifier;

public class YoloDetector extends BaseDetector {
    private Path yoloPath;
    private Net model;
    private int imageSize;
    private double scoreThreshold;
    private double iouThreshold;

    public YoloDetector(String yoloPath, int imageSize, double scoreThreshold, double iouThreshold) {
        this.yoloPath = basePath.resolve(yoloPath);
        this.model = Dnn.readNetFromONNX(this.yoloPath.toString());
        this.imageSize = imageSize;
        this.scoreThreshold = scoreThreshold;
        this.iouThreshold = iouThreshold;
    }

    private SimpleEntry<Double, Mat> preprocess(Mat image) {
        int width = image.cols();
        int height = image.rows();
        int length = Math.max(width, height);
        double scale = (double) length / imageSize;

        Mat blob = Mat.zeros(imageSize, imageSize, CvType.CV_8UC3);
        Rect roi = new Rect(0, 0, width, height);
        image.copyTo(blob.submat(roi));
        
        blob = Dnn.blobFromImage(blob, 1/255.0, new Size(imageSize, imageSize), new Scalar(0, 0, 0), true);
        return new SimpleEntry<>(scale, blob);
    }

    public ArrayList<DetectionResult> detect(Mat image) {
        ArrayList<DetectionResult> candidates = new ArrayList<>();

        SimpleEntry<Double, Mat> res = preprocess(image);
        double scale = res.getKey();
        Mat blob = res.getValue();
        model.setInput(blob);
        
        Mat output = model.forward();
        Mat transposed = new Mat();
        Core.transpose(output.reshape(1, output.size(1)), transposed);

        for (int i = 0; i < transposed.rows(); i++) {
            Mat row = transposed.row(i);
            float[] data = new float[(int) row.total()];
            row.get(0, 0, data);  // Copy Mat data to a float array
            
            if (data[4] < this.scoreThreshold) continue;

            double centerX = data[0];
            double centerY = data[1];
            double w = data[2];
            double h = data[3];

            double x = (centerX - (0.5 * w)) * scale;
            double y = (centerY - (0.5 * h)) * scale;
            w = w * scale;
            h = h * scale;

            candidates.add(new DetectionResult(new Rect2d(x, y, w, h), data[4]));
        }
        candidates = nonMaximumSuppression(candidates);

        return candidates;
    }

    public static void main(String[] args) {
        
    }
}
