package com.smu.smartattendancesystem.dto;

import java.time.LocalDateTime;

public class StudentSessionAttendanceDTO {

    // Retrieved from session
    private final Long sessionId;
    private final String courseName;
    private final Long rosterId;
    private final String rosterName;
    private final LocalDateTime startAt;
    private final LocalDateTime endAt;
    private final int lateAfterMinutes;
    private final boolean isOpen;

    // Attendance information for the session
    private final String status;
    private final String method;
    private final Double confidence;
    private final LocalDateTime timestamp;
    private final Integer arrivalOffsetMinutes; // minutes difference from startAt ( how early/late student is (0 = on
                                                // time, +5 = 5 minutes late, -3 = 3
    // minutes early))

    public StudentSessionAttendanceDTO(
            Long sessionId,
            String courseName,
            Long rosterId,
            String rosterName,
            LocalDateTime startAt,
            LocalDateTime endAt,
            int lateAfterMinutes,
            boolean isOpen,
            String status,
            String method,
            Double confidence,
            LocalDateTime timestamp,
            Integer arrivalOffsetMinutes) {
        this.sessionId = sessionId;
        this.courseName = courseName;
        this.rosterId = rosterId;
        this.rosterName = rosterName;
        this.startAt = startAt;
        this.endAt = endAt;
        this.lateAfterMinutes = lateAfterMinutes;
        this.isOpen = isOpen;
        this.status = status;
        this.method = method;
        this.confidence = confidence;
        this.timestamp = timestamp;
        this.arrivalOffsetMinutes = arrivalOffsetMinutes;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public String getCourseName() {
        return courseName;
    }

    public Long getRosterId() {
        return rosterId;
    }

    public String getRosterName() {
        return rosterName;
    }

    public LocalDateTime getStartAt() {
        return startAt;
    }

    public LocalDateTime getEndAt() {
        return endAt;
    }

    public int getLateAfterMinutes() {
        return lateAfterMinutes;
    }

    public boolean isOpen() {
        return isOpen;
    }

    public String getStatus() {
        return status;
    }

    public String getMethod() {
        return method;
    }

    public Double getConfidence() {
        return confidence;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public Integer getArrivalOffsetMinutes() {
        return arrivalOffsetMinutes;
    }
}
