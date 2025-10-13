package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;

@Entity
@Table(name = "roster")
public class Roster extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    // Optional: link to session if your DB design includes it
    // (comment this out if roster only connects course <-> student)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private Session session;

    private boolean active = true; // You can toggle whether a student is active in the course roster

    // Constructors
    public Roster() {}

    public Roster(Course course, Student student) {
        this.course = course;
        this.student = student;
        this.active = true;
    }

    // Getters and Setters
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

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
