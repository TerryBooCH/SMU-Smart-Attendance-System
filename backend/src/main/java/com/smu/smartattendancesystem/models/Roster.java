package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Table(name = "roster")
public class Roster extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    // Relationship: One roster -> Many student_roster entries
    @OneToMany(mappedBy = "roster", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudentRoster> studentRosters = new ArrayList<>();

    // ✅ Constructors
    public Roster() {}
    
    public Roster(String name) {
        this.name = name;
    }

    // ✅ Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<StudentRoster> getStudentRosters() {
        return studentRosters;
    }

    public void setStudentRosters(List<StudentRoster> studentRosters) {
        this.studentRosters = studentRosters;
    }

    // ✅ Get all Students (for API use)
    @Transient
    public List<Student> getStudents() {
        return studentRosters.stream()
                .map(StudentRoster::getStudent)
                .collect(Collectors.toList());
    }

    // ✅ Add a single student to roster
    public boolean addToRoster(Student student) {
        boolean alreadyExists = studentRosters.stream()
                .anyMatch(sr -> sr.getStudent().getId().equals(student.getId()));
        if (alreadyExists) {
            return false;
        }
        StudentRoster studentRoster = new StudentRoster(student, this);
        studentRosters.add(studentRoster);
        return true;
    }

    // ✅ Remove a student from roster by ID
    public boolean removeFromRoster(Long studentId) {
        return studentRosters.removeIf(sr -> sr.getStudent().getId().equals(studentId));
    }

    // ✅ Remove all students from this roster
    public void clearRoster() {
        studentRosters.clear();
    }

    // ✅ Add multiple students at once
    public void addAllStudents(List<Student> students) {
        for (Student student : students) {
            addToRoster(student);
        }
    }
}
