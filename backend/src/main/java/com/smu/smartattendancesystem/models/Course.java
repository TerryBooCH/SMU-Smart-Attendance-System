package com.smu.smartattendancesystem.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/**
 * Entity class representing a Course in the system.
 * Follows Single Responsibility Principle - handles only course data.
 * ID is inherited from BaseEntity with auto-increment strategy.
 */
@Entity
@Table(name = "course")
public class Course extends BaseEntity {
    
    @Column(nullable = false, unique = true, length = 20)
    private String code;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    // Constructors
    public Course() {
        super();
    }
    
    public Course(String code, String title) {
        super();
        this.code = code;
        this.title = title;
    }
    
    // Getters and Setters
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    @Override
    public String toString() {
        return "Course{" +
                "id=" + getId() +
                ", code='" + code + '\'' +
                ", title='" + title + '\'' +
                ", createdAt=" + getCreatedAt() +
                '}';
    }
}