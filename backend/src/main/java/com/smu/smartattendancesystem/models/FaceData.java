package com.smu.smartattendancesystem.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "face_data")
public class FaceData extends BaseEntity {

    @Column(nullable = false)
    private String imagePath; // Stores path/filename of student's face image

    @Lob // Tells JPA this field may be large (BLOB)
    private byte[] embedding; // Stores the face embedding (numerical vector, 128-512 floats, stored as byte array)

    // The owning side of the Many-To-One relationship with Student
    @ManyToOne(fetch = FetchType.LAZY, optional = false) 
    @JoinColumn(name = "student_id", nullable = false) // Adds a foreign key column 'student_id' linking to Student's PK (id)
    private Student student;

    // Constructors
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
