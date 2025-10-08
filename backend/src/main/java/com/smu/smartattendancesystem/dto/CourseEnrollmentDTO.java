package com.smu.smartattendancesystem.dto;

import java.time.LocalDateTime;

import com.smu.smartattendancesystem.models.CourseEnrollment;

/**
 * DTO to prevent circular reference issues when serializing enrollments
 * Only includes necessary data without nested entities
 */
public class CourseEnrollmentDTO {
    
    private Long id;
    private Long courseId;
    private String courseCode;
    private String courseTitle;
    private String studentId;
    private String studentName;
    private String studentEmail;
    private LocalDateTime enrolledAt;
    private LocalDateTime createdAt;
    
    // Default constructor for Jackson
    public CourseEnrollmentDTO() {}
    
    // Constructor from entity
    public CourseEnrollmentDTO(CourseEnrollment enrollment) {
        this.id = enrollment.getId();
        this.courseId = enrollment.getCourse().getId();
        this.courseCode = enrollment.getCourse().getCode();
        this.courseTitle = enrollment.getCourse().getTitle();
        this.studentId = enrollment.getStudent().getStudentId();
        this.studentName = enrollment.getStudent().getName();
        this.studentEmail = enrollment.getStudent().getEmail();
        this.enrolledAt = enrollment.getEnrolledAt();
        this.createdAt = enrollment.getCreatedAt();
    }
    
    // Static factory method for cleaner code
    public static CourseEnrollmentDTO fromEntity(CourseEnrollment enrollment) {
        return new CourseEnrollmentDTO(enrollment);
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getCourseId() {
        return courseId;
    }
    
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
    
    public String getCourseCode() {
        return courseCode;
    }
    
    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }
    
    public String getCourseTitle() {
        return courseTitle;
    }
    
    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }
    
    public String getStudentId() {
        return studentId;
    }
    
    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }
    
    public String getStudentName() {
        return studentName;
    }
    
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
    
    public String getStudentEmail() {
        return studentEmail;
    }
    
    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }
    
    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }
    
    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}