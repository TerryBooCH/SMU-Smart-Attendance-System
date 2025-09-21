package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;

@Entity
@Table(name = "face_data")
public class FaceData extends BaseEntity {

    @Column(nullable = false)
    private String imagePath; // Stores path/filename of student's face image

    @Lob // Tells JPA this field may be large (BLOB)
    private byte[] embedding; // Stores the face embedding (numerical vector, 128-512 floats, stored as byte array)

    @OneToOne // The owning side of the one-to-one realtionship with Student
    @JoinColumn(name = "student_id", nullable = false) // Adds a aforeign key column 'student_id' linking to Student's primary key
    private Student student;

    public FaceData() {}

    public FaceData(String imagePath, byte[] embedding) { // Constructor for creating new face entries
        this.imagePath = imagePath;
        this.embedding = embedding;
    }

    // Getters & Setters
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

    public Student getStudent() { 
        return student; 
    }

    public void setStudent(Student student) { 
        this.student = student;
    }
}
