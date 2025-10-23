package com.smu.smartattendancesystem.dto;

public class RecognitionResultDTO {
    private DetectionResultDTO detection;
    private StudentWithFaceDTO top_student;
    private double recognition_score;

    public RecognitionResultDTO(DetectionResultDTO detection, StudentWithFaceDTO top_student, double recognition_score) {
        this.detection = detection;
        this.top_student = top_student;
        this.recognition_score = recognition_score;
    }
    
    public StudentWithFaceDTO getTop_student() {
        return top_student;
    }

    public void setTop_student(StudentWithFaceDTO top_student) {
        this.top_student = top_student;
    }

    public double getRecognition_score() {
        return recognition_score;
    }

    public void setRecognition_score(double recognition_score) {
        this.recognition_score = recognition_score;
    }
}