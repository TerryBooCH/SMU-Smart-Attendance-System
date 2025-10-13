package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "roster")
public class Roster extends BaseEntity {

    @Column(nullable = false)
    private String name;

    // Relationships
    @ManyToMany(mappedBy = "rosters")
    private List<Student> students;

    @OneToMany(mappedBy = "roster", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Session> sessions;

    // Constructors
    public Roster() {
    }

    public Roster(String name) {
        this.name = name;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }

    public List<Session> getSessions() {
        return sessions;
    }

    public void setSessions(List<Session> sessions) {
        this.sessions = sessions;
    }
}
