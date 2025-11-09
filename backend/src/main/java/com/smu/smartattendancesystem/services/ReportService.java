package com.smu.smartattendancesystem.services;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.smu.smartattendancesystem.dto.SessionSummaryDTO;
import com.smu.smartattendancesystem.dto.StudentAttendanceSummaryDTO;
import com.smu.smartattendancesystem.dto.StudentSessionAttendanceDTO;
import com.smu.smartattendancesystem.managers.AttendanceManager;
import com.smu.smartattendancesystem.managers.SessionManager;
import com.smu.smartattendancesystem.managers.StudentManager;
import com.smu.smartattendancesystem.models.Attendance;
import com.smu.smartattendancesystem.models.Roster;
import com.smu.smartattendancesystem.models.Session;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.models.StudentRoster;
import com.smu.smartattendancesystem.repositories.AttendanceRepository;
import com.smu.smartattendancesystem.repositories.StudentRosterRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ReportService {

    private SessionManager sessionManager;
    private AttendanceManager attendanceManager;
    private StudentManager studentManager;
    private StudentRosterRepository studentRosterRepository;
    private AttendanceRepository attendanceRepository;

    public ReportService(SessionManager sessionManager,
            AttendanceManager attendanceManager,
            StudentManager studentManager,
            StudentRosterRepository studentRosterRepository,
            AttendanceRepository attendanceRepository) {
        this.sessionManager = sessionManager;
        this.attendanceManager = attendanceManager;
        this.studentManager = studentManager;
        this.studentRosterRepository = studentRosterRepository;
        this.attendanceRepository = attendanceRepository;
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

    public StudentAttendanceSummaryDTO getStudentAttendanceSummary(String studentId) {

        // Validate student
        Student student = studentManager.getStudentByStudentId(studentId)
                .orElseThrow(() -> new NoSuchElementException("Student not found: " + studentId));

        List<StudentRoster> studentRosters = studentRosterRepository.findByStudent(student);

        // If student is not inside a roster
        if (studentRosters.isEmpty()) {
            return new StudentAttendanceSummaryDTO(
                    new ArrayList<>(), // return empty sessions
                    student.getStudentId(),
                    student.getName(),
                    student.getClassName(),
                    0, 0, 0, 0, 0, 0,
                    0.0, 0.0, 0.0, 0.0);
        }

        // Retrieve student roster
        Roster roster = studentRosters.get(0).getRoster();

        // Retrieve all sessions belonging to the roster
        List<Session> sessions = sessionManager.getSessionsByRosterId(roster.getId());

        // If roster exists but has no sessions yet
        if (sessions.isEmpty()) {
            return new StudentAttendanceSummaryDTO(
                    new ArrayList<>(),
                    student.getStudentId(),
                    student.getName(),
                    student.getClassName(),
                    0, 0, 0, 0, 0, 0,
                    0.0, 0.0, 0.0, 0.0);
        }

        // Retrieve student attendances for the sessions retrieved
        List<Long> sessionIds = new ArrayList<>(sessions.size());
        for (Session s : sessions) {
            sessionIds.add(s.getId());
        }

        List<Attendance> attendances = attendanceRepository.findByStudentIdAndSessionIdIn(student.getId(), sessionIds);

        // Map the attendances with the relevant sessions for O(1) lookups
        Map<Long, Attendance> attendanceBySessionId = new HashMap<>();
        for (Attendance a : attendances) {
            attendanceBySessionId.put(a.getSession().getId(), a);
        }

        // Build a per-session summary object for the student
        int totalSessions = sessions.size();
        int presentCount = 0;
        int lateCount = 0;
        int absentCount = 0;
        int pendingCount = 0;
        int unmarkedCount = 0;

        List<StudentSessionAttendanceDTO> sessionDetails = new ArrayList<>(totalSessions);

        for (Session s : sessions) {
            // Retrieve the attendance
            Attendance a = attendanceBySessionId.get(s.getId());

            String status;
            String method;
            Double confidence = null;
            LocalDateTime timestamp = null;
            Integer offsetMinutes = null;

            // If attendance exists, student's attendance was marked
            if (a != null) {
                status = a.getStatus();
                method = a.getMethod();
                confidence = a.getConfidence();
                timestamp = a.getTimestamp();

                // Check the status of the attendance
                if (status != null) {
                    switch (status.toUpperCase()) {
                        case "PRESENT" -> presentCount++;
                        case "LATE" -> lateCount++;
                        case "ABSENT" -> absentCount++;
                        case "PENDING" -> pendingCount++;
                        default -> {
                        } // do nothing
                    }
                }

                // Calculate how early/late student is (0 = on time, +5 = 5 minutes late, -3 = 3
                // minutes early)
                if (timestamp != null && s.getStartAt() != null) {
                    offsetMinutes = (int) Duration.between(s.getStartAt(), timestamp).toMinutes();
                }
            } else {
                // If attendance does not exist, student's attendance is unmarked
                status = "UNMARKED";
                method = "NOT MARKED";
                unmarkedCount++;
            }
            // Build the per-session DTO
            sessionDetails.add(new StudentSessionAttendanceDTO(
                    s.getId(),
                    s.getCourseName(),
                    s.getRoster() != null ? s.getRoster().getId() : null, // if roster exists, return it's id, else
                                                                          // return null
                    s.getRoster() != null ? s.getRoster().getName() : null, // if roster exists, return it's name, else
                                                                            // return null
                    s.getStartAt(),
                    s.getEndAt(),
                    s.getLateAfterMinutes() != null ? s.getLateAfterMinutes() : 15, // if no lateAfterMinutes set, set
                                                                                    // default to 15 minutes
                    s.isOpen(),
                    status,
                    method,
                    confidence,
                    timestamp,
                    offsetMinutes));
        }

        // Compute attendance rates
        double denom = totalSessions == 0 ? 1.0 : (double) totalSessions;
        double attendanceRate = (presentCount + lateCount) / denom;
        double punctualRate = presentCount / denom;
        double lateRate = lateCount / denom;
        double absentRate = absentCount / denom;

        // Return summary
        return new StudentAttendanceSummaryDTO(
                sessionDetails,
                student.getStudentId(),
                student.getName(),
                student.getClassName(),
                totalSessions,
                presentCount,
                lateCount,
                absentCount,
                pendingCount,
                unmarkedCount,
                attendanceRate,
                punctualRate,
                lateRate,
                absentRate);
    }

}
