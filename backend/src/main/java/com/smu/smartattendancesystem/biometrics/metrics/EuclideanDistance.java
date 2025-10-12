package com.smu.smartattendancesystem.biometrics.metrics;

public class EuclideanDistance extends BaseMetric {
    @Override
    public double compareVectors(double[] v1, double[] v2) {
        if (v1.length != v2.length) throw new IllegalArgumentException("Vectors must have the same length.");

        double sum = 0.0;
        for (int i = 0; i < v1.length; i++) {
            double diff = v1[i] - v2[i];
            sum += diff * diff;
        }

        return Math.sqrt(sum);
    }
}
