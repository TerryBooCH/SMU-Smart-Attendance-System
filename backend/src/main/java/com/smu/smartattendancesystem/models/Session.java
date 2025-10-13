package com.smu.smartattendancesystem.models;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

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

    // Each session belongs to a single roster (group of students)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roster_id", nullable = false)
    private Roster roster;

    // One session has many attendance records
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attendance> attendances = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (sessionDate == null) {
            sessionDate = LocalDate.now();
        }
        if (lateAfterMinutes == null) {
            lateAfterMinutes = 15;
        }
    }

    // Constructors
    public Session() {
    }

    public Session(Roster roster, String name, String startAt, String endAt, String location, boolean isOpen,
            Integer lateAfterMinutes) {
        this.roster = roster;
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

    public LocalDate getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(LocalDate sessionDate) {
        this.sessionDate = sessionDate;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Roster getRoster() {
        return roster;
    }

    public void setRoster(Roster roster) {
        this.roster = roster;
    }

    public List<Attendance> getAttendances() {
        return attendances;
    }

    public void setAttendances(List<Attendance> attendances) {
        this.attendances = attendances;
    }
}
