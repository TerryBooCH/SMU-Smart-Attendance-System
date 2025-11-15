package com.smu.smartattendancesystem.biometrics;

import java.io.IOException;
import org.opencv.core.*;
import org.springframework.web.multipart.MultipartFile;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;

import com.smu.smartattendancesystem.biometrics.detection.*;

public class ImageUtils {
    static { nu.pattern.OpenCV.loadLocally(); }

    public static Mat fileToMat(MultipartFile file) throws IOException {
        // Read bytes from the MultipartFile
        byte[] bytes = file.getBytes();
        MatOfByte mob = new MatOfByte(bytes);

        // Decode image to OpenCV Mat
        Mat image = Imgcodecs.imdecode(mob, Imgcodecs.IMREAD_COLOR);

        return image;
    }

    public static Mat crop(DetectionResult detectionResult, Mat image) {
        Rect2d roi = detectionResult.getBbox();
        Mat face = image.submat(
            Math.clamp(Math.round(roi.y), 0, image.rows()),
            Math.clamp(Math.round(roi.y + roi.height), 0, image.rows()),
            Math.clamp(Math.round(roi.x), 0, image.cols()),
            Math.clamp(Math.round(roi.x + roi.width), 0, image.cols())
        );
        return face; 
    } 

    // TODO: align the image according to landmarks. (New attribute for DetectionResult meant for MTCNN)
    public static Mat crop_and_align(DetectionResult detectionResult, Mat image) {
        throw new UnsupportedOperationException("Not implemented yet");
        // return new Mat();
    }

    
    // Method depends on the instance variable image size, so it can't be a static method
    public static Mat letterbox_resize(Mat image, int image_size, Scalar fillColor) {
        int w = image.cols();
        int h = image.rows();
        
        // Calculate scaling factor
        double scale = Math.min((double) image_size / w, (double) image_size / h);
        int newW = (int) Math.round(w * scale);
        int newH = (int) Math.round(h * scale);
        
        // Resize the image
        Mat resized = new Mat();
        Imgproc.resize(image, resized, new Size(newW, newH), 0, 0, Imgproc.INTER_AREA);
        
        // Create new canvas with fill color
        Mat output = new Mat(new Size(image_size, image_size), image.type(), fillColor);
        
        // Center the resized image on the canvas
        int xOffset = (image_size - newW) / 2;
        int yOffset = (image_size - newH) / 2;
        Rect roi = new Rect(xOffset, yOffset, newW, newH);
        
        // Place the resized image inside
        Mat destROI = output.submat(roi);
        resized.copyTo(destROI);
        
        return output;
    }
    
    public static Mat normalize(Mat image) {
        Mat normalized = new Mat();
        image.convertTo(normalized, CvType.CV_32F, 1.0 / 255.0);

        return normalized;
    }

    public static Mat greyscale(Mat image) {
        Mat gray = new Mat();
        if (image.channels() > 1) {
            Imgproc.cvtColor(image, gray, Imgproc.COLOR_BGR2GRAY);
        } else {
            gray = image.clone();
        }
        return gray;
    }

    public static double[] flatten(Mat image) {
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
}