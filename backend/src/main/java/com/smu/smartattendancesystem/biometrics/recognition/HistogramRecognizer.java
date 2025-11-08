package com.smu.smartattendancesystem.biometrics.recognition;
import java.util.*;
import org.opencv.core.*;
import org.opencv.imgproc.Imgproc;
import com.smu.smartattendancesystem.biometrics.metrics.*;

public class HistogramRecognizer extends BaseRecognizer {
    public HistogramRecognizer(int img_size, BaseMetric metric) {
        super(img_size, metric);
    }
    
    public HistogramRecognizer(int img_size) {
        super(img_size);
    }
     
    private static Mat computeHistogram(Mat image) {
        Mat hist = new Mat();
        MatOfInt histSize = new MatOfInt(64);
        MatOfFloat ranges = new MatOfFloat(0f, 256);
        MatOfInt channels = new MatOfInt(0);

        Imgproc.calcHist(List.of(image), channels, new Mat(), hist, histSize, ranges);
        Core.normalize(hist, hist, 0, 1, Core.NORM_MINMAX);
        return hist;
    }

    public double computeScore(Mat faceA, Mat faceB) {
        Mat histA = computeHistogram(faceA);
        Mat histB = computeHistogram(faceB);

        return Imgproc.compareHist(histA, histB, Imgproc.HISTCMP_CORREL);
    }
}
