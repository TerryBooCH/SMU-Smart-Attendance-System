package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "session")
public class Session extends BaseEntity {

    private String name;
    private LocalDate sessionDate;
    private String startAt;
    private String endAt;
    private boolean isOpen;
    private Integer lateAfterMinutes;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, fetch = FetchType.LAZY) // One-to-many relationship with Attendance
    private List<Attendance> attendances;

    // Constructors
    public Session() {}

    public Session(String name, LocalDate sessionDate, String startAt, String endAt, boolean isOpen, Integer lateAfterMinutes) { // Constructor to make new sessions
        this.name = name;
        this.sessionDate = sessionDate;
        this.startAt = startAt;
        this.endAt = endAt;
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
}
