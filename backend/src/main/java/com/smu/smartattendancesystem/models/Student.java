package com.smu.smartattendancesystem.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "student")
public class Student extends BaseEntity {

    @Column(name = "student_id", nullable = false, unique = true)
    private String studentId; // e.g. S1234567A

    @Column(nullable = false)
    private String name;

    private String email;
    private String phone;

    // Relationships
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FaceData> faceDataList;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<StudentRoster> studentRosters = new ArrayList<>();

    @OneToOne(mappedBy = "student", fetch = FetchType.LAZY)
    private User user;

    // Constructors
    public Student() {
    }

    public Student(String studentId, String name, String email, String phone) {
        this.studentId = studentId;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    // Getters and Setters
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

    public List<FaceData> getFaceDataList() {
        return faceDataList;
    }

    public void setFaceDataList(List<FaceData> faceDataList) {
        this.faceDataList = faceDataList;
    }
}
