package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "session")
public class Session extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roster_id", nullable = false)
    private Roster roster;

    @Column(name = "course_name", nullable = false)
    private String courseName;

    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    private LocalDateTime endAt;

    @Column(name = "is_open", nullable = false)
    private boolean isOpen = false;

    private Integer lateAfterMinutes;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attendance> attendanceList;

    // Constructors
    public Session() {
    }

    public Session(Roster roster, String courseName, LocalDateTime startAt, LocalDateTime endAt) {
        this.roster = roster;
        this.courseName = courseName;
        this.startAt = startAt;
        this.endAt = endAt;
    }

    // Getters and Setters
    public Roster getRoster() {
        return roster;
    }

    public void setRoster(Roster roster) {
        this.roster = roster;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public LocalDateTime getStartAt() {
        return startAt;
    }

    public void setStartAt(LocalDateTime startAt) {
        this.startAt = startAt;
    }

    public LocalDateTime getEndAt() {
        return endAt;
    }

    public void setEndAt(LocalDateTime endAt) {
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

    public List<Attendance> getAttendanceList() {
        return attendanceList;
    }

    public void setAttendanceList(List<Attendance> attendanceList) {
        this.attendanceList = attendanceList;
    }
}
