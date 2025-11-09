package com.smu.smartattendancesystem.dto;

import java.time.LocalDateTime;

public class SessionSummaryDTO {

    // Retrieved from session
    private Long sessionId;
    private String courseName;
    private Long rosterId;
    private int rosterSize; // expected students
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private int lateAfterMinutes;
    private boolean isOpen;

    // Computed based on attendance records for the session
    private int markedCount; // rows with status != pending
    private int unmarkedCount; // unmarked attendances (rosterSize − markedCount)
    private int presentCount;
    private int lateCount;
    private int absentCount;
    private int pendingCount;

    // Attendance rate
    private double attendanceRate; // (present + late) / rosterSize
    private double punctualRate; // present / rosterSize
    private double lateRate; // late / rosterSize
    private double absentRate; // absent / rosterSize

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
