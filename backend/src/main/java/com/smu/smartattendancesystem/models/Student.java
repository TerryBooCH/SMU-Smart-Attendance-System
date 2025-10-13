package com.smu.smartattendancesystem.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "student")
public class Student extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String studentId;

    private String name;
    private String email;
    private String phone;

    // A student can have multiple face data records
    @JsonIgnore
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FaceData> faceData = new ArrayList<>();

    // A student can be part of multiple rosters
    @JsonIgnore
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudentRoster> studentRosters = new ArrayList<>();

    // A student can have multiple attendance records across sessions
    @JsonIgnore
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attendance> attendances = new ArrayList<>();

    // Constructors
    public Student() {
    }

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

    public List<StudentRoster> getStudentRosters() {
        return studentRosters;
    }

    public void setStudentRosters(List<StudentRoster> studentRosters) {
        this.studentRosters = studentRosters;
    }

    public List<Attendance> getAttendances() {
        return attendances;
    }

    public void setAttendances(List<Attendance> attendances) {
        this.attendances = attendances;
    }
}
