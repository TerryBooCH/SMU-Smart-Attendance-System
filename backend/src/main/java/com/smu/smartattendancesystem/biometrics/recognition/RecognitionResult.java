package com.smu.smartattendancesystem.biometrics.recognition;

import com.smu.smartattendancesystem.models.Student;

public class RecognitionResult {
    private Student student;
	private double score;

    public RecognitionResult(Student student, double score) {
        this.student = student;
        this.score = score;
    }

    public Student getStudent() {
        return this.student;
    }

    public void setStudent(Student student) {
		this.student = student;
	}

    public double getScore() {
        return this.score;
    }

    public void setScore(double score) {
        this.score = score;
    }

}