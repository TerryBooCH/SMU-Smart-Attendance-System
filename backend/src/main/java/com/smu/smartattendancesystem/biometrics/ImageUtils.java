package com.smu.smartattendancesystem.biometrics;

import java.io.IOException;
import org.opencv.core.*;
import org.springframework.web.multipart.MultipartFile;
import org.opencv.imgcodecs.Imgcodecs;
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
}