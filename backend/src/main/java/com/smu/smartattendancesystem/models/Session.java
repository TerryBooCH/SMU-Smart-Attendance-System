package com.smu.smartattendancesystem.models;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "session")
public class Session extends BaseEntity {

    private String name;
    private LocalDate sessionDate;
    private String startAt;
    private String endAt;
    private boolean isOpen;
    private Integer lateAfterMinutes;
    private String location;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, fetch = FetchType.LAZY) // One-to-many relationship with Attendance
    private List<Attendance> attendances;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToMany
    @JoinTable(
        name = "session_roster",
        joinColumns = @JoinColumn(name = "session_id"),
        inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private List<Student> roster = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (sessionDate == null) {
            sessionDate = LocalDate.now(); // Auto-set to today
        }
        if (lateAfterMinutes == null) {
            lateAfterMinutes = 15; // Default late threshold
        }
    }

    // Constructors
    public Session() {}

    public Session(Course course, String name, String startAt, String endAt, String location, boolean isOpen, Integer lateAfterMinutes) {
        this.course = course;
        this.name = name;
        this.startAt = startAt;
        this.endAt = endAt;
        this.location = location;
        this.isOpen = isOpen;
        this.lateAfterMinutes = lateAfterMinutes;
    }

    // Getters & Setters
    public String getName() { 
        return name; 
    }

    public void setName(String name) { 
        this.name = name; 
    }

    public String getStartAt() { 
        return startAt; 
    }

    public void setStartAt(String startAt) { 
        this.startAt = startAt; 
    }

    public String getEndAt() { 
        return endAt; 
    }

    public void setEndAt(String endAt) { 
        this.endAt = endAt; 
    }

    public boolean isOpen() { 
        return isOpen; 
    }

    public void setOpen(boolean open) { 
        isOpen = open; 
    }

    public Integer getLateAfterMinutes() { 
        return lateAfterMinutes; 
    }

    public void setLateAfterMinutes(Integer lateAfterMinutes) { 
        this.lateAfterMinutes = lateAfterMinutes; 
    }

    public List<Attendance> getAttendances() { 
        return attendances; 
    }

    public void setAttendances(List<Attendance> attendances) { 
        this.attendances = attendances; 
    }

    public LocalDate getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(LocalDate sessionDate) {
        this.sessionDate = sessionDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public List<Student> getRoster() { 
        return roster; 
    }

    public void setRoster(List<Student> roster) { 
        this.roster = roster; 
    }

    // Add student to roster with duplicate check
    public boolean addToRoster(Student student) {
        if (student == null) {
            return false;
        }
        // Check for duplicates
        if (roster.stream().anyMatch(s -> s.getId().equals(student.getId()))) {
            return false;
        }
        return roster.add(student);
    }

    // Remove student from roster
    public boolean removeFromRoster(Long studentId) {
        return roster.removeIf(s -> s.getId().equals(studentId));
    }
}
