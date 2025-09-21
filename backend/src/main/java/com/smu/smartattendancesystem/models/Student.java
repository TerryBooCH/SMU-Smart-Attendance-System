package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;

@Entity
@Table(name = "student")
public class Student extends BaseEntity { 

    @Column(nullable = false, unique = true)
    private String studentId;

    private String name;
    private String email;
    private String phone;

    // One-to-one with FaceData
    @OneToOne(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY) // Any operation on Student also applies to FaceData
    private FaceData faceData;

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

    public FaceData getFaceData() { 
        return faceData; 
    }

    public void setFaceData(FaceData faceData) { 
        this.faceData = faceData; 
    }
}
