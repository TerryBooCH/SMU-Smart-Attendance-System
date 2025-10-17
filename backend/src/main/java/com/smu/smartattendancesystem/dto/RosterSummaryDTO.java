package com.smu.smartattendancesystem.dto;

import java.time.LocalDateTime;

public class RosterSummaryDTO {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int studentCount;

    public RosterSummaryDTO(Long id, String name, LocalDateTime createdAt, LocalDateTime updatedAt, int studentCount) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.studentCount = studentCount;
    }

    // Getters only (no need for setters unless you need them)
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public int getStudentCount() {
        return studentCount;
    }
}
