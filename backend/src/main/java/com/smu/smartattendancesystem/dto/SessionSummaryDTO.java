package com.smu.smartattendancesystem.dto;

import java.time.LocalDateTime;

public class SessionSummaryDTO {

    // Retrieved from session
    private final Long sessionId;
    private final String courseName;
    private final Long rosterId;
    private final int rosterSize; // expected students
    private final LocalDateTime startAt;
    private final LocalDateTime endAt;
    private final int lateAfterMinutes;
    private final boolean isOpen;

    // Computed based on attendance records for the session
    private final int markedCount; // rows with status != pending
    private final int unmarkedCount; // unmarked attendances (rosterSize − markedCount)
    private final int presentCount;
    private final int lateCount;
    private final int absentCount;
    private final int pendingCount;

    // Attendance rate
    private final double attendanceRate; // (present + late) / rosterSize
    private final double punctualRate; // present / rosterSize
    private final double lateRate; // late / rosterSize
    private final double absentRate; // absent / rosterSize

    public SessionSummaryDTO(
            Long sessionId,
            String courseName,
            Long rosterId,
            int rosterSize,
            LocalDateTime startAt,
            LocalDateTime endAt,
            int lateAfterMinutes,
            boolean isOpen,
            int markedCount,
            int unmarkedCount,
            int presentCount,
            int lateCount,
            int absentCount,
            int pendingCount,
            double attendanceRate,
            double punctualRate,
            double lateRate,
            double absentRate) {
        this.sessionId = sessionId;
        this.courseName = courseName;
        this.rosterId = rosterId;
        this.rosterSize = rosterSize;
        this.startAt = startAt;
        this.endAt = endAt;
        this.lateAfterMinutes = lateAfterMinutes;
        this.isOpen = isOpen;
        this.markedCount = markedCount;
        this.unmarkedCount = unmarkedCount;
        this.presentCount = presentCount;
        this.lateCount = lateCount;
        this.absentCount = absentCount;
        this.pendingCount = pendingCount;
        this.attendanceRate = attendanceRate;
        this.punctualRate = punctualRate;
        this.lateRate = lateRate;
        this.absentRate = absentRate;
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

    public int getRosterSize() {
        return rosterSize;
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

    public int getMarkedCount() {
        return markedCount;
    }

    public int getUnmarkedCount() {
        return unmarkedCount;
    }

    public int getPresentCount() {
        return presentCount;
    }

    public int getLateCount() {
        return lateCount;
    }

    public int getAbsentCount() {
        return absentCount;
    }

    public int getPendingCount() {
        return pendingCount;
    }

    public double getAttendanceRate() {
        return attendanceRate;
    }

    public double getPunctualRate() {
        return punctualRate;
    }

    public double getLateRate() {
        return lateRate;
    }

    public double getAbsentRate() {
        return absentRate;
    }
}
