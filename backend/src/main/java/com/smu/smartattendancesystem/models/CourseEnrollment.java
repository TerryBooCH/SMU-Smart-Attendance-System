package com.smu.smartattendancesystem.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "course_enrollment")
public class CourseEnrollment extends BaseEntity {
    
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt;
    
    // Constructors
    public CourseEnrollment() {
        this.enrolledAt = LocalDateTime.now();
    }
    
    public CourseEnrollment(Course course, Student student) {
        this.course = course;
        this.student = student;
        this.enrolledAt = LocalDateTime.now();
    }
    
    // Getters & Setters
    public Course getCourse() {
        return course;
    }
    
    public void setCourse(Course course) {
        this.course = course;
    }
    
    public Student getStudent() {
        return student;
    }
    
    public void setStudent(Student student) {
        this.student = student;
    }
    
    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }
    
    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }
}