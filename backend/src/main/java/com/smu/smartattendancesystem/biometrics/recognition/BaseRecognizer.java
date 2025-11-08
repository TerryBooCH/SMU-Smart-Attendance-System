package com.smu.smartattendancesystem.biometrics.recognition;
import java.nio.file.*;
import java.util.*;
import org.opencv.core.*;
import org.opencv.imgproc.Imgproc;
import com.smu.smartattendancesystem.biometrics.metrics.*;
import com.smu.smartattendancesystem.biometrics.detection.DetectionResult;

public abstract class BaseRecognizer {
    static { nu.pattern.OpenCV.loadLocally(); }
    protected static final Path basePath = Paths.get(System.getProperty("user.dir"));
    protected int image_size;
    protected BaseMetric metric;

	public BaseRecognizer(int image_size, BaseMetric metric) {
        this.image_size = image_size;
        this.metric = metric;
    }

    public BaseRecognizer(int image_size) {
        this(image_size, new CosineSimilarity());
    }

    // Returns the index of the face has the highest similarity with
    public RecognitionResult recognize(Mat face, List<Mat> dataset) {
        List<Double> scores = computeScore(face, dataset);
        int bestIndex = 0;
        for (int i = 1; i < scores.size(); i++) {
            if (scores.get(i) > scores.get(bestIndex)) {
                bestIndex = i;
            }
        }

        return new RecognitionResult(bestIndex, scores.get(bestIndex));
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

    // Method depends on the instance variable image size, so it can't be a static method
    protected Mat letterbox_resize(Mat image, Scalar fillColor) {
        int w = image.cols();
        int h = image.rows();
        
        // Calculate scaling factor
        double scale = Math.min((double) this.image_size / w, (double) this.image_size / h);
        int newW = (int) Math.round(w * scale);
        int newH = (int) Math.round(h * scale);
        
        // Resize the image
        Mat resized = new Mat();
        Imgproc.resize(image, resized, new Size(newW, newH), 0, 0, Imgproc.INTER_AREA);
        
        // Create new canvas with fill color
        Mat output = new Mat(new Size(this.image_size, this.image_size), image.type(), fillColor);
        
        // Center the resized image on the canvas
        int xOffset = (this.image_size - newW) / 2;
        int yOffset = (this.image_size - newH) / 2;
        Rect roi = new Rect(xOffset, yOffset, newW, newH);
        
        // Place the resized image inside
        Mat destROI = output.submat(roi);
        resized.copyTo(destROI);
        
        return output;
    }
    
    protected static Mat normalize(Mat image) {
        Mat normalized = new Mat();
        image.convertTo(normalized, CvType.CV_32F, 1.0 / 255.0);

        return normalized;
    }

    protected static Mat greyscale(Mat image) {
        Mat gray = new Mat();
        if (image.channels() > 1) {
            Imgproc.cvtColor(image, gray, Imgproc.COLOR_BGR2GRAY);
        } else {
            gray = image.clone();
        }
        return gray;
    }

    protected static double[] flatten(Mat image) {
        int channels = image.channels();
        int rows = image.rows();
        int cols = image.cols();
        double[] flat = new double[rows * cols * channels];

        int idx = 0;
        float[] buffer = new float[cols * channels];  // for CV_32F
        for (int i = 0; i < rows; i++) {
            image.get(i, 0, buffer);
            for (int j = 0; j < buffer.length; j++) {
                flat[idx++] = buffer[j];
            }
        }
        return flat;
    }

    public BaseMetric getMetric() {
		return metric;
	}

	public void setMetric(BaseMetric metric) {
		this.metric = metric;
	}
}
