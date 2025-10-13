package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;

@Entity
@Table(name = "student_roster")
public class StudentRoster { // Does not extend BaseEntity so the id wont conflict with StudentRosterId for primary key

    @EmbeddedId
    private StudentRosterId id = new StudentRosterId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("studentId")
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("rosterId")
    @JoinColumn(name = "roster_id", nullable = false)
    private Roster roster;

    @Column(name = "created_at")
    private String createdAt;

    public StudentRoster() {}

    public StudentRoster(Student student, Roster roster) {
        this.student = student;
        this.roster = roster;
    }

    // Getters and Setters
    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Roster getRoster() {
        return roster;
    }

    public void setRoster(Roster roster) {
        this.roster = roster;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
