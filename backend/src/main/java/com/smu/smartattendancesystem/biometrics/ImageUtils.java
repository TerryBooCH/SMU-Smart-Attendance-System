package com.smu.smartattendancesystem.biometrics;

import java.io.IOException;
import org.opencv.core.*;
import org.springframework.web.multipart.MultipartFile;
import org.opencv.imgcodecs.Imgcodecs;

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
}