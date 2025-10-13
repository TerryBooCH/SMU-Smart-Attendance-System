package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Entity
@Table(name = "user")
public class User extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "permission_level", nullable = false)
    private int permissionLevel; // 0 = Student, 1 = TA, 2 = Professor

    // Optional link to Student table
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    private Student student;

    // ─────────────────────────────────────────────
    // Constructors
    // ─────────────────────────────────────────────

    public User() {
    }

    public User(String name, String email, String plainPassword, int permissionLevel) {
        this.name = name;
        this.email = email;
        this.passwordHash = hashPassword(plainPassword);
        this.permissionLevel = permissionLevel;
    }

    public User(String name, String email, String plainPassword, int permissionLevel, Student student) {
        this(name, email, plainPassword, permissionLevel);
        this.student = student;
    }

    // ─────────────────────────────────────────────
    // Password Handling
    // ─────────────────────────────────────────────

    private String hashPassword(String plainPassword) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = md.digest(plainPassword.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b)); // Convert byte to hex
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    public boolean checkPassword(String plainPassword) {
        return this.passwordHash.equals(hashPassword(plainPassword));
    }

    @JsonProperty("password") // Accept "password" from JSON input
    public void setPassword(String plainPassword) {
        this.passwordHash = hashPassword(plainPassword);
    }

    // ─────────────────────────────────────────────
    // Getters and Setters
    // ─────────────────────────────────────────────

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

    // ─────────────────────────────────────────────
    // Helper Methods
    // ─────────────────────────────────────────────

    public boolean isLinkedToStudent() {
        return student != null;
    }

    public String getLinkedStudentId() {
        return (student != null) ? student.getStudentId() : null;
    }
}
