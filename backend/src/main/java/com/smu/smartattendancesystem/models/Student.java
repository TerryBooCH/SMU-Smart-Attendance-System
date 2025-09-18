package com.smu.smartattendancesystem.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Student {

    @Id
    private String studentId; // Example: S12345

    private String name;
    private String classGroup; // Example: CS102
    private String email;
    private String phone;

    // Constructors
    public Student() {}

    public Student(String studentId, String name, String classGroup, String email, String phone) {
        this.studentId = studentId;
        this.name = name;
        this.classGroup = classGroup;
        this.email = email;
        this.phone = phone;
    }

    // Getters and Setters
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getClassGroup() { return classGroup; }
    public void setClassGroup(String classGroup) { this.classGroup = classGroup; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}