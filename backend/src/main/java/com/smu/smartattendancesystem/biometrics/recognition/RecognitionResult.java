package com.smu.smartattendancesystem.biometrics.recognition;

public class RecognitionResult {
    private int index;
	private double score;

    public RecognitionResult(int index, double score) {
        this.index = index;
        this.score = score;
    }

    public int getIndex() {
        return this.index;
    }

    public void setIndex(int index) {
		this.index = index;
	}

    public double getScore() {
        return this.score;
    }

    public void setScore(double score) {
        this.score = score;
    }

}