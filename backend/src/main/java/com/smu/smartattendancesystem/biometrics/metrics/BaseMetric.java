package com.smu.smartattendancesystem.biometrics.metrics;

public abstract class BaseMetric {
    public abstract double compareVectors(double[] v1, double[] v2);
}
