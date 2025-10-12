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
import com.smu.smartattendancesystem.biometrics.metrics.*;

public class EigenFaceRecognizer extends BaseRecognizer {
    private PCA pca;
    private BaseMetric metric;

    public EigenFaceRecognizer(PCA pca, BaseMetric metric, int image_size) {
        super(image_size);

        this.pca = pca;
        this.metric = metric;
    }

    public EigenFaceRecognizer(PCA pca, BaseMetric metric) {
        this(pca, metric, 64);
    }

    public static EigenFaceRecognizer fromConfig(Path jsonPath, BaseMetric metric) throws IOException{
        ObjectMapper mapper = new ObjectMapper();

        Map<String, Object> config = mapper.readValue(jsonPath.toFile(), new TypeReference<Map<String, Object>>() {});

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

        Matrix projection = Matrix.of(components);
        Matrix loadings = projection.transpose();

        PCA pca = new PCA(mean, eigenvalues, loadings, projection);

        return new EigenFaceRecognizer(pca, metric, image_size);
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
        double[] vectorA = transform(faceA);
        double[] vectorB = transform(faceB);

        return metric.compareVectors(vectorA, vectorB);
    }
}
