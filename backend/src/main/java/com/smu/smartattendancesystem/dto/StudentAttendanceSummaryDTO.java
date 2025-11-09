package com.smu.smartattendancesystem.dto;

import java.util.List;

public class StudentAttendanceSummaryDTO {

    // Student information
    private final String studentId;
    private final String name;
    private final String className;

    // Computed based on attendance records for the session
    private final int totalSessions;
    private final int presentCount;
    private final int lateCount;
    private final int absentCount;
    private final int pendingCount;
    private final int unmarkedCount;

    // Attendance rate
    private final double attendanceRate;
    private final double punctualRate;
    private final double lateRate;
    private final double absentRate;

    private final List<StudentSessionAttendanceDTO> sessions;

    public StudentAttendanceSummaryDTO(
            List<StudentSessionAttendanceDTO> sessions,
            String studentId,
            String name,
            String className,
            int totalSessions,
            int presentCount,
            int lateCount,
            int absentCount,
            int pendingCount,
            int unmarkedCount,
            double attendanceRate,
            double punctualRate,
            double lateRate,
            double absentRate) {
        this.sessions = sessions;
        this.studentId = studentId;
        this.name = name;
        this.className = className;
        this.totalSessions = totalSessions;
        this.presentCount = presentCount;
        this.lateCount = lateCount;
        this.absentCount = absentCount;
        this.pendingCount = pendingCount;
        this.unmarkedCount = unmarkedCount;
        this.attendanceRate = attendanceRate;
        this.punctualRate = punctualRate;
        this.lateRate = lateRate;
        this.absentRate = absentRate;

    }

    public String getStudentId() {
        return studentId;
    }

    public String getName() {
        return name;
    }

    public String getClassName() {
        return className;
    }

    public int getTotalSessions() {
        return totalSessions;
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

    public int getUnmarkedCount() {
        return unmarkedCount;
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

    public List<StudentSessionAttendanceDTO> getSessions() {
        return sessions;
    }
}
