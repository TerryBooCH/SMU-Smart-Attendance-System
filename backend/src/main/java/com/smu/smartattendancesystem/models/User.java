package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "user")
public class User extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true) 
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private int permissionLevel; // 0 = Student, 1 = TA, 2 = Professor

    // Default constructor required by JPA
    public User() {}

    // Constructor: takes plain password, hashes it, and stores it
    public User(String name, String email, String plainPassword, int permissionLevel) {
        this.name = name;
        this.email = email;
        this.passwordHash = hashPassword(plainPassword);
        this.permissionLevel = permissionLevel;
    }

    // Hashing method (SHA-256)
    private String hashPassword(String plainPassword) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = md.digest(plainPassword.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b)); // Convert to hex
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    // Password verification
    public boolean checkPassword(String plainPassword) {
        return this.passwordHash.equals(hashPassword(plainPassword));
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

    @JsonProperty("password") // Accept "password" from JSON as plain text
    public void setPassword(String plainPassword) {
        this.passwordHash = hashPassword(plainPassword);
    }
}
