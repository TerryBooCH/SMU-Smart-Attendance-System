package com.smu.smartattendancesystem.biometrics.detection;

import java.util.*;
import java.nio.file.Path;
import java.util.AbstractMap.SimpleEntry;

import org.opencv.core.*;
import org.opencv.dnn.Dnn;
import org.opencv.dnn.Net;
import org.opencv.imgproc.Imgproc;
import org.opencv.objdetect.CascadeClassifier;

public class YoloDetector extends BaseDetector {
    private Path yoloPath;
    private Net model;
    private int imageSize;
    private double scoreThreshold;
    private double iouThreshold;

    // imageSize is the size of the image the model itself will be working with
    // It is NOT the input size of the image, letterbox resizing is applied so no other
    // preprocessing step is needed.
    public YoloDetector(String yoloPath, int imageSize, double scoreThreshold, double iouThreshold) {
        this.yoloPath = basePath.resolve(yoloPath);
        this.model = Dnn.readNetFromONNX(this.yoloPath.toString());
        this.imageSize = imageSize;
        this.scoreThreshold = scoreThreshold;
        this.iouThreshold = iouThreshold;
    }

    public YoloDetector(String yoloPath, int imageSize, double scoreThreshold) {
        this(yoloPath, imageSize, scoreThreshold, 0.7);
    }

    public YoloDetector(String yoloPath, int imageSize) {
        this(yoloPath, imageSize, 0.5);
    }

    public YoloDetector(String yoloPath) {
        this(yoloPath, 640);
    }

    private Map<String, Object> preprocess(Mat image) {
        int width = image.cols();
        int height = image.rows();
        int length = Math.max(width, height);
        double scale = (double) length / imageSize;

        int newW = (int) Math.round(width / scale);
        int newH = (int) Math.round(height / scale);

        Mat resized = new Mat();
        Imgproc.resize(image, resized, new Size(newW, newH));

        Mat blob = Mat.zeros(imageSize, imageSize, CvType.CV_8UC3);
        int dx = (imageSize - newW) / 2;
        int dy = (imageSize - newH) / 2;

        Rect roi = new Rect(dx, dy, newW, newW);
        resized.copyTo(blob.submat(roi));
        
        blob = Dnn.blobFromImage(blob, 1/255.0, new Size(imageSize, imageSize), new Scalar(0, 0, 0), true);

        Map<String, Object> result = new HashMap<>();
        result.put("blob", blob);
        result.put("scale", scale);
        result.put("dx", dx);
        result.put("dy", dy);
        return result;
    }

    public List<DetectionResult> detect(Mat image) {
        List<DetectionResult> candidates = new ArrayList<>();

        Map<String, Object> res = preprocess(image);
        double scale = (double) res.get("scale");
        Mat blob = (Mat) res.get("blob");
        int dx = (int) res.get("dx");
        int dy = (int) res.get("dy");
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

            double x = (centerX - (0.5 * w) - dx) * scale;
            double y = (centerY - (0.5 * h) - dy) * scale;
            w = w * scale;
            h = h * scale;

            candidates.add(new DetectionResult(new Rect2d(x, y, w, h), data[4]));
        }
        candidates = nonMaximumSuppression(candidates);

        return candidates;
    }
}
