package com.smu.smartattendancesystem.models;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

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

    @Column(name = "permission_level", nullable = false)
    private int permissionLevel; // 0 = Student, 1 = TA, 2 = Professor

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    @JsonIgnore
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
        return new BCryptPasswordEncoder().encode(plainPassword); // Hash using BCrypt
    }

    public boolean checkPassword(String plainPassword) {
        return new BCryptPasswordEncoder().matches(plainPassword, this.passwordHash);
    }

    @JsonProperty("password")
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
