package com.smu.smartattendancesystem.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smu.smartattendancesystem.dto.SessionSummaryDTO;
import com.smu.smartattendancesystem.managers.AttendanceManager;
import com.smu.smartattendancesystem.managers.SessionManager;
import com.smu.smartattendancesystem.models.Attendance;
import com.smu.smartattendancesystem.models.Session;
import com.smu.smartattendancesystem.models.StudentRoster;
import com.smu.smartattendancesystem.repositories.StudentRosterRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ReportService {

    private final SessionManager sessionManager;
    private final AttendanceManager attendanceManager;
    private final StudentRosterRepository studentRosterRepository;

    public ReportService(SessionManager sessionManager,
            AttendanceManager attendanceManager,
            StudentRosterRepository studentRosterRepository) {
        this.sessionManager = sessionManager;
        this.attendanceManager = attendanceManager;
        this.studentRosterRepository = studentRosterRepository;
    }

    public SessionSummaryDTO getSessionSummary(Long sessionId) {

        // Check if session exists
        Session session = sessionManager.getSession(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Session not found"));

        // Retrieve attendance records
        List<Attendance> attendances = attendanceManager.getAttendanceBySessionId(sessionId);

        // Compute roster size for the session, and retrieve students for the roster
        int rosterSize = 0;
        List<StudentRoster> studentRosters;
        if (session.getRoster() != null) {
            studentRosters = studentRosterRepository.findByRoster(session.getRoster());
            rosterSize = studentRosters.size();
        }

        // Check the statuses for the attendance records
        int presentCount = 0;
        int lateCount = 0;
        int absentCount = 0;
        int pendingCount = 0;

        for (Attendance attendance : attendances) {
            String status = attendance.getStatus();

            // prevent nullpointerexception in toUpperCase()
            if (status == null) {
                continue;
            }

            switch (status.toUpperCase()) {
                case "PRESENT" -> presentCount++;
                case "LATE" -> lateCount++;
                case "ABSENT" -> absentCount++;
                case "PENDING" -> pendingCount++;
                default -> {
                } // do nothing
            }
        }

        // Compute attendance counts
        int markedCount = presentCount + lateCount + absentCount; // all except pending
        int unmarkedCount = rosterSize - markedCount;

        // Compute attendance rates
        double denom = rosterSize == 0 ? 1.0 : rosterSize; // if roster size is 0, set denom to 1, else set it to
                                                           // rosterSize
        double attendanceRate = (presentCount + lateCount) / denom;
        double punctualRate = presentCount / denom;
        double lateRate = lateCount / denom;
        double absentRate = absentCount / denom;

        // Return the SessionSummaryDTO
        return new SessionSummaryDTO(
                session.getId(),
                session.getCourseName(),
                session.getRoster() != null ? session.getRoster().getId() : null, // if roster exists, return rosterId,
                                                                                  // else return null
                rosterSize,
                session.getStartAt(),
                session.getEndAt(),
                session.getLateAfterMinutes() != null ? session.getLateAfterMinutes() : 15, // use the value specified,
                                                                                            // else fallback to 15
                                                                                            // minutes by default
                session.isOpen(),
                markedCount,
                unmarkedCount,
                presentCount,
                lateCount,
                absentCount,
                pendingCount,
                attendanceRate,
                punctualRate,
                lateRate,
                absentRate);
    }

}
