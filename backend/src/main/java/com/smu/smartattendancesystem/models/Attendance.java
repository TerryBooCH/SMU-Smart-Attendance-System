package com.smu.smartattendancesystem.models;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "attendance")
public class Attendance extends BaseEntity {

    @ManyToOne // Many Attendance records can reference one Student
    @JoinColumn(name = "student_id", nullable = false) // Foreign key column for 'student_id'
    private Student student;

    @ManyToOne // Many Attendance records can reference one Session
    @JoinColumn(name = "session_id", nullable = false)// Foreign key column for 'session_id'
    private Session session;

    private String status;    // present, absent, late
    private String method;    // manual, face-recognition
    private Double confidence;
    private String timestamp;

    // Constructors
    public Attendance() {} // No-argument constructor required fr JPA

    public Attendance(Student student, Session session, String status, String method, Double confidence, String timestamp) { // Constructor to create Attendance records
        this.student = student;
        this.session = session;
        this.status = status;
        this.method = method;
        this.confidence = confidence;
        this.timestamp = timestamp;
    }

    // Getters & Setters
    public Student getStudent() { 
        return student; 
    }

    public void setStudent(Student student) { 
        this.student = student; 
    }

    public Session getSession() { 
        return session; 
    }
    public void setSession(Session session) { 
        this.session = session; 
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

    public String getTimestamp() { 
        return timestamp; 
    }

    public void setTimestamp(String timestamp) { 
        this.timestamp = timestamp; 
    }
}
