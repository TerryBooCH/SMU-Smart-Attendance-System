package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Entity
@Table(name = "roster")
public class Roster extends BaseEntity {

    @Column(nullable = false)
    private String name;

    // Relationships
    @ManyToMany(mappedBy = "rosters")
    private List<Student> students = new ArrayList<>();

    @OneToMany(mappedBy = "roster", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Session> sessions = new ArrayList<>();

    // Constructors
    public Roster() {
    }

    public Roster(String name) {
        this.name = name;
    }

    // Getters & Setters
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

    // --- Custom Helper Methods ---
    public void clearRoster() {
        students.clear();
    }

    public void addAllStudents(List<Student> newStudents) {
        students.clear();
        students.addAll(newStudents);
    }

    public boolean addToRoster(Student student) {
        if (students.stream().anyMatch(s -> s.getId().equals(student.getId()))) {
            return false; // already exists
        }
        students.add(student);
        return true;
    }

    public boolean removeFromRoster(Long studentId) {
        Iterator<Student> it = students.iterator();
        while (it.hasNext()) {
            Student s = it.next();
            if (s.getId().equals(studentId)) {
                it.remove();
                return true;
            }
        }
        return false;
    }
}
