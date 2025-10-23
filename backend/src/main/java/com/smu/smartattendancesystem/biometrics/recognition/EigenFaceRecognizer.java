package com.smu.smartattendancesystem.biometrics.recognition;

import java.io.IOException;
import java.io.UncheckedIOException;
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
import com.smu.smartattendancesystem.biometrics.metrics.*;

public class EigenFaceRecognizer extends BaseRecognizer {
    private PCA pca;

    public EigenFaceRecognizer(PCA pca, int image_size) {
        super(image_size);
        this.pca = pca;
    }

	public EigenFaceRecognizer(PCA pca, int image_size, BaseMetric metric) {
        this(pca, image_size);
        this.metric = metric;
    }

    public static EigenFaceRecognizer fromConfig(String path) {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> config;
        
        try {
            config = mapper.readValue(basePath.resolve(path).toFile(), new TypeReference<Map<String, Object>>() {});
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }

        int image_size = ((Number) config.get("img_size")).intValue();

        List<Double> meanList = (List<Double>) config.get("mean");
        double[] mean = meanList.stream().mapToDouble(Double::doubleValue).toArray();

        List<List<Double>> compList = (List<List<Double>>) config.get("components");
        double[][] components = new double[compList.size()][compList.get(0).size()];
        for (int i = 0; i < compList.size(); i++) {
            List<Double> row = compList.get(i);
            for (int j = 0; j < row.size(); j++) {
                components[i][j] = row.get(j);
            }
        }

        List<Double> eigList = (List<Double>) config.get("eigenvalues");
        double[] eigenvalues = eigList.stream().mapToDouble(Double::doubleValue).toArray();

        Matrix projection = Matrix.of(components);
        Matrix loadings = projection.transpose();

        PCA pca = new PCA(mean, eigenvalues, loadings, projection);

        return new EigenFaceRecognizer(pca, image_size);
    }

    public static EigenFaceRecognizer fromConfig(String path, BaseMetric metric) {
        EigenFaceRecognizer recognizer = fromConfig(path);
        recognizer.setMetric(metric);

        return recognizer;
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
        if (metric == null) throw new IllegalStateException("Metric has not been set.");

        double[] vectorA = transform(faceA);
        double[] vectorB = transform(faceB);

        return metric.compareVectors(vectorA, vectorB);
    }
}
