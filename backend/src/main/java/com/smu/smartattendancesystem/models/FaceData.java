package com.smu.smartattendancesystem.models;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "face_data")
public class FaceData extends BaseEntity {

    // The owning side of the Many-To-One relationship with Student
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false) // Adds a foreign key column 'student_id' linking to Student's PK id
    @JsonIgnore
    private Student student;

    @Column(name = "image_path", nullable = false)
    private String imagePath; // Stores path/filename of student's face image

    private LocalDateTime capturedAt = LocalDateTime.now();

    // Constructors
    public FaceData() {
    }

    public FaceData(Student student, String imagePath) {
        this.student = student;
        this.imagePath = imagePath;
    }

    public FaceData(String imagePath) {
        this.imagePath = imagePath;
    }

    // Getters and Setters
    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public LocalDateTime getCapturedAt() {
        return capturedAt;
    }

    public void setCapturedAt(LocalDateTime capturedAt) {
        this.capturedAt = capturedAt;
    }
}
