package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "session_id", "student_id" })
})
public class Attendance extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private String status; // PENDING | PRESENT | ABSENT | LATE

    @Column(nullable = false)
    private String method; // AUTO | MANUAL | EDGE

    private Double confidence;
    private LocalDateTime timestamp = LocalDateTime.now();

    // Constructors
    public Attendance() {
    }

    public Attendance(Session session, Student student, String status, String method, Double confidence) {
        this.session = session;
        this.student = student;
        this.status = status;
        this.method = method;
        this.confidence = confidence;
    }

    // Getters and Setters
    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
