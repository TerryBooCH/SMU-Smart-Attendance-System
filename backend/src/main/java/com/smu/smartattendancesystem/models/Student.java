package com.smu.smartattendancesystem.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "student")
public class Student extends BaseEntity { 

    @Column(nullable = false, unique = true)
    private String studentId;

    private String name;
    private String email;
    private String phone;

    // Create a One-to-Many relationship with FaceData (1 student to 10-20 images)
    @JsonIgnore
    @OneToMany(
        mappedBy = "student", 
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<FaceData> faceData = new ArrayList<>();

    // Constructors
    public Student() {}

    public Student(String studentId, String name, String email, String phone) {
        this.studentId = studentId;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    // Getters & Setters
    public String getStudentId() { 
        return studentId; 
    }

    public void setStudentId(String studentId) { 
        this.studentId = studentId; 
    }

    public String getName() { 
        return name; 
    
    }
    public void setName(String name) { 
        this.name = name; 
    }

    public String getEmail() { 
        return email; 
    }
    public void setEmail(String email) { 
        this.email = email; 
    }

    public String getPhone() { 
        return phone; 
    }

    public void setPhone(String phone) { 
        this.phone = phone; 
    }

    public List<FaceData> getFaceData() {
        return faceData;
    }

    public void setFaceData(List<FaceData> faceData) {
        this.faceData = faceData;
    }
}
