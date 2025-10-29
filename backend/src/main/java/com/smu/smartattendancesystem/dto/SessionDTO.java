package com.smu.smartattendancesystem.dto;

import java.time.LocalDateTime;

public class SessionDTO {
    private Long id;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String courseName;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private boolean isOpen;
    private Integer lateAfterMinutes;
    private Long rosterId;
    private String rosterName;

    // Constructor
    public SessionDTO(Long id, LocalDateTime createdAt, LocalDateTime updatedAt,
                      String courseName, LocalDateTime startAt, LocalDateTime endAt,
                      boolean isOpen, Integer lateAfterMinutes,
                      Long rosterId, String rosterName) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.courseName = courseName;
        this.startAt = startAt;
        this.endAt = endAt;
        this.isOpen = isOpen;
        this.lateAfterMinutes = lateAfterMinutes;
        this.rosterId = rosterId;
        this.rosterName = rosterName;
    }

    // Getters only (DTOs are typically read-only)
    public Long getId() { return id; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public String getCourseName() { return courseName; }
    public LocalDateTime getStartAt() { return startAt; }
    public LocalDateTime getEndAt() { return endAt; }
    public boolean isOpen() { return isOpen; }
    public Integer getLateAfterMinutes() { return lateAfterMinutes; }
    public Long getRosterId() { return rosterId; }
    public String getRosterName() { return rosterName; }
}
