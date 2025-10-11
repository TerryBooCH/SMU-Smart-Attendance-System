package com.smu.smartattendancesystem.biometrics.recognition;
import java.nio.file.Path;
import java.util.*;
import org.opencv.core.*;
import org.opencv.imgproc.Imgproc;
import smile.data.*;
import smile.feature.extraction.PCA;;

public class EigenFaceRecognizer extends BaseRecognizer {
    private int image_size = 64; 
    private int pca_dim = 32;

    public EigenFaceRecognizer(int image_size, int pca_dim) {
        this.image_size = image_size;
        this.pca_dim = pca_dim;
    }

    public EigenFaceRecognizer(int image_size) {
        this(image_size, 32);
    }
    
    public EigenFaceRecognizer() {
        this(64, 32);
    }

    public static EigenFaceRecognizer fromConfig(Path jsonPath) {
        // TODO load config containing image_size, pca_dim, and each of the principal components

        return new EigenFaceRecognizer();
    }

    public double computeScore(Mat faceA, Mat faceB) {
        
        return 0.0;
    }
}
