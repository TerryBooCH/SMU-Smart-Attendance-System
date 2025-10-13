package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "face_data")
public class FaceData extends BaseEntity {

    // The owning side of the Many-To-One relationship with Student
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false) // Adds a foreign key column 'student_id' linking to Student's PK
                                                       // (id)
    private Student student;

    @Column(name = "image_path", nullable = false)
    private String imagePath; // Stores path/filename of student's face image

    @Lob // Tells JPA this field may be large (BLOB)
    private byte[] embedding; // Stores the face embedding (numerical vector, 128-512 floats, stored as byte
                              // array)

    private LocalDateTime capturedAt = LocalDateTime.now();

    // Constructors
    public FaceData() {
    }

    public FaceData(Student student, String imagePath, byte[] embedding) {
        this.student = student;
        this.imagePath = imagePath;
        this.embedding = embedding;
    }

    public FaceData(String imagePath, byte[] embedding) {
        this.imagePath = imagePath;
        this.embedding = embedding;
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

    public byte[] getEmbedding() {
        return embedding;
    }

    public void setEmbedding(byte[] embedding) {
        this.embedding = embedding;
    }

    public LocalDateTime getCapturedAt() {
        return capturedAt;
    }

    public void setCapturedAt(LocalDateTime capturedAt) {
        this.capturedAt = capturedAt;
    }
}
