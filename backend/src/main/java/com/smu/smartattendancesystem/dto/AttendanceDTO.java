package com.smu.smartattendancesystem.dto;

import java.time.LocalDateTime;

public class AttendanceDTO {
    private Long id;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status;
    private String method;
    private Double confidence;
    private LocalDateTime timestamp;
    
    // Student info
    private Long studentId;
    private String studentStudentId;
    private String studentName;
    private String studentEmail;
    private String studentPhone;
    private String studentClassName;
    
    // Session info (minimal)
    private Long sessionId;
    private String sessionCourseName;
    private Boolean sessionOpen;

    // Constructors
    public AttendanceDTO() {}

    public AttendanceDTO(Long id, LocalDateTime createdAt, LocalDateTime updatedAt, 
                        String status, String method, Double confidence, LocalDateTime timestamp,
                        Long studentId, String studentStudentId, String studentName, 
                        String studentEmail, String studentPhone, String studentClassName,
                        Long sessionId, String sessionCourseName, Boolean sessionOpen) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.status = status;
        this.method = method;
        this.confidence = confidence;
        this.timestamp = timestamp;
        this.studentId = studentId;
        this.studentStudentId = studentStudentId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.studentPhone = studentPhone;
        this.studentClassName = studentClassName;
        this.sessionId = sessionId;
        this.sessionCourseName = sessionCourseName;
        this.sessionOpen = sessionOpen;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentStudentId() { return studentStudentId; }
    public void setStudentStudentId(String studentStudentId) { this.studentStudentId = studentStudentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentPhone() { return studentPhone; }
    public void setStudentPhone(String studentPhone) { this.studentPhone = studentPhone; }

    public String getStudentClassName() { return studentClassName; }
    public void setStudentClassName(String studentClassName) { this.studentClassName = studentClassName; }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public String getSessionCourseName() { return sessionCourseName; }
    public void setSessionCourseName(String sessionCourseName) { this.sessionCourseName = sessionCourseName; }

    public Boolean getSessionOpen() { return sessionOpen; }
    public void setSessionOpen(Boolean sessionOpen) { this.sessionOpen = sessionOpen; }
}