package com.smu.smartattendancesystem.biometrics.recognition;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import org.opencv.core.*;
import org.opencv.imgproc.Imgproc;
import smile.data.*;
import smile.feature.extraction.PCA;
import smile.math.matrix.Matrix;

import com.fasterxml.jackson.core.json.*;
import com.fasterxml.jackson.core.type.*;
import com.fasterxml.jackson.databind.ObjectMapper;

public class EigenFaceRecognizer extends BaseRecognizer {
    private int image_size = 64; 
    private PCA pca;

    public EigenFaceRecognizer(PCA pca, int image_size) {
        this.pca = pca;
        this.image_size = image_size;
    }
    
    public EigenFaceRecognizer(PCA pca) {
        this(pca, 64);
    }

    public static EigenFaceRecognizer fromConfig(Path jsonPath) throws IOException{
        // TODO load config containing image_size, pca_dim, and each of the principal components
        ObjectMapper mapper = new ObjectMapper();

        Map<String, Object> config = mapper.readValue(jsonPath.toFile(), new TypeReference<Map<String, Object>>() {});
        System.out.println(config);

        int image_size = ((Number) config.get("img_size")).intValue();

        @SuppressWarnings("unchecked")
        List<Double> meanList = (List<Double>) config.get("mean");
        double[] mean = meanList.stream().mapToDouble(Double::doubleValue).toArray();

        @SuppressWarnings("unchecked")
        List<List<Double>> compList = (List<List<Double>>) config.get("components");
        double[][] components = new double[compList.size()][compList.get(0).size()];
        for (int i = 0; i < compList.size(); i++) {
            List<Double> row = compList.get(i);
            for (int j = 0; j < row.size(); j++) {
                components[i][j] = row.get(j);
            }
        }

        @SuppressWarnings("unchecked")
        List<Double> eigList = (List<Double>) config.get("eigenvalues");
        double[] eigenvalues = eigList.stream().mapToDouble(Double::doubleValue).toArray();

        Matrix loadings = Matrix.of(components);
        Matrix projection = loadings.transpose();

        PCA pca = new PCA(mean, eigenvalues, loadings, projection);

        return new EigenFaceRecognizer(pca, image_size);
    }

    private Mat letterbox_resize(Mat image, Scalar fillColor) {
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
    
    private static Mat normalize(Mat image) {
        Mat normalized = new Mat();
        image.convertTo(normalized, CvType.CV_32F, 1.0 / 255.0);

        return normalized;
    }

    private static Mat greyscale(Mat image) {
        Mat gray = new Mat();
        if (image.channels() > 1) {
            Imgproc.cvtColor(image, gray, Imgproc.COLOR_BGR2GRAY);
        } else {
            gray = image.clone(); // already grayscale
        }
        return gray;
    }

    private static double[] flatten(Mat image) {
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

    public double[] transform(Mat face) {
        Mat resized = letterbox_resize(face, new Scalar(128));
        Mat grey = greyscale(resized);
        Mat normalized = normalize(grey);
        double[] flat = flatten(normalized);

        double[] result = pca.apply(flat);
        return result;
    }

    public double computeScore(Mat faceA, Mat faceB) {
        
        return 0.0;
    }

    public static void main(String[] args) {
        Path path = basePath.resolve("src\\main\\resources\\weights\\mtcnn_eigenface.config");

        try {
            EigenFaceRecognizer recognizer = EigenFaceRecognizer.fromConfig(path);
        } catch (IOException e) {
            System.out.println("failed");
        }
        System.out.println("test");
    }
}
