package com.smu.smartattendancesystem.models;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user")
public class User extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true) 
    private String email;
    
    @JsonIgnore
    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private int permissionLevel; // 0 = Student, 1 = TA, 2 = Professor

    // Optional foreign key to Student table - only for users who are students
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = true) // Makes it optional
    private Student student;

    // Default constructor required by JPA
    public User() {}

    // Constructor: takes plain password, hashes it, and stores it
    public User(String name, String email, String plainPassword, int permissionLevel) {
        this.name = name;
        this.email = email;
        this.passwordHash = hashPassword(plainPassword);
        this.permissionLevel = permissionLevel;
        this.student = null; // Initially no student association
    }

    // Constructor with student association
    public User(String name, String email, String plainPassword, int permissionLevel, Student student) {
        this.name = name;
        this.email = email;
        this.passwordHash = hashPassword(plainPassword);  
        this.permissionLevel = permissionLevel;
        this.student = student;
    }

    private String hashPassword(String plainPassword) {
        return new BCryptPasswordEncoder().encode(plainPassword); // Hash the password using BCrypt
    }

    public boolean checkPassword(String plainPassword) {
        return new BCryptPasswordEncoder().matches(plainPassword, this.passwordHash);
    }

    // Getters & Setters
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

    public String getPasswordHash() { 
        return passwordHash; 
    }

    public int getPermissionLevel() {
        return permissionLevel;
    }

    public void setPermissionLevel(int permissionLevel) {
        this.permissionLevel = permissionLevel;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    // Helper method to check if user is linked to a student
    public boolean isLinkedToStudent() {
        return student != null;
    }

    // Helper method to get student ID if linked
    public String getLinkedStudentId() {
        return student != null ? student.getStudentId() : null;
    }

    // Accept "password" from JSON as plain text and hash it
    @JsonProperty("password")
    public void setPassword(String plainPassword) {
        this.passwordHash = hashPassword(plainPassword);
    }
}