package com.smu.smartattendancesystem.dto;

import java.util.*;
import com.smu.smartattendancesystem.models.*;

public class RecognitionResultDTO {
    private DetectionResultDTO detected;
	private Student top_student;
    private double recognition_score;
    private Optional<Attendance> attendance;

	public RecognitionResultDTO(DetectionResultDTO detected, Student top_student, double recognition_score, Optional<Attendance> attendance) {
        this.detected = detected;
        this.top_student = top_student;
        this.recognition_score = recognition_score;
        this.attendance = attendance;
    }
    
    public DetectionResultDTO getDetected() {
		return detected;
	}

	public void setDetected(DetectionResultDTO detected) {
		this.detected = detected;
	}

    public Student getTop_student() {
        return top_student;
    }

    public void setTop_student(Student top_student) {
        this.top_student = top_student;
    }

    public double getRecognition_score() {
        return recognition_score;
    }

    public void setRecognition_score(double recognition_score) {
        this.recognition_score = recognition_score;
    }

    public Optional<Attendance> getAttendance() {
		return attendance;
	}

	public void setAttendance(Optional<Attendance> attendance) {
		this.attendance = attendance;
	}
}

