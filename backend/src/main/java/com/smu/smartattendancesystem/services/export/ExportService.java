package com.smu.smartattendancesystem.services.export;

import java.io.OutputStream;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.smu.smartattendancesystem.dto.StudentAttendanceSummaryDTO;
import com.smu.smartattendancesystem.dto.StudentSessionAttendanceDTO;
import com.smu.smartattendancesystem.managers.AttendanceManager;
import com.smu.smartattendancesystem.repositories.StudentRosterRepository;
import com.smu.smartattendancesystem.managers.SessionManager;
import com.smu.smartattendancesystem.managers.StudentManager;
import com.smu.smartattendancesystem.models.Attendance;
import com.smu.smartattendancesystem.models.Session;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.models.StudentRoster;
import com.smu.smartattendancesystem.services.ReportService;

@Service
public class ExportService {
    private ReportService reportService;
    private StudentManager studentManager;
    private SessionManager sessionManager;
    private StudentRosterRepository studentRosterRepository;
    private AttendanceManager attendanceManager;

    private static final List<String> STUDENT_EXPORT_HEADERS = List.of(
            "Student ID", "Name", "Class",
            "Session ID", "Roster Name",
            "Start Time", "End Time", "Late After (min)",
            "Status", "Method", "Confidence", "Timestamp",
            "Arrival Offset (min)", "Open");

    private static final List<String> SESSION_EXPORT_HEADERS = List.of(
            "Student ID", "Name", "Class",
            "Session ID", "Roster Name",
            "Start Time", "End Time", "Late After (min)",
            "Status", "Method", "Confidence", "Timestamp",
            "Arrival Offset (min)", "Open");

    public ExportService(ReportService reportService,
            StudentManager studentManager,
            SessionManager sessionManager,
            StudentRosterRepository studentRosterRepository,
            AttendanceManager attendanceManager) {
        this.reportService = reportService;
        this.studentManager = studentManager;
        this.sessionManager = sessionManager;
        this.studentRosterRepository = studentRosterRepository;
        this.attendanceManager = attendanceManager;
    }

    // Exports a student's attendance summary using the given ReportGenerator
    public void exportStudentAttendance(String studentId, ReportGenerator generator, OutputStream out)
            throws Exception {

        // Retrieve student's attendance summary
        StudentAttendanceSummaryDTO summary = reportService.getStudentAttendanceSummary(studentId);
        List<StudentSessionAttendanceDTO> details = summary.getSessions();
        Student student = studentManager.getStudentByStudentId(studentId)
                .orElseThrow(() -> new NoSuchElementException("Student not found: " + studentId));

        // Retrieve headers
        List<String> headers = headersForStudent();

        // Build the rows to match the headers
        List<List<String>> rows = new ArrayList<>(details.size());
        for (StudentSessionAttendanceDTO d : details) {
            rows.add(List.of(
                    // Student info
                    checkString(summary.getStudentId()), // Student ID
                    checkString(summary.getName()), // Name
                    checkString(summary.getClassName()), // Class

                    // Session fields
                    String.valueOf(d.getSessionId()), // Session ID
                    checkString(d.getRosterName()), // Roster Name
                    checkTime(d.getStartAt()), // Start Time
                    checkTime(d.getEndAt()), // End Time
                    String.valueOf(d.getLateAfterMinutes()), // Late After (min)

                    // Attendance fields
                    checkString(d.getStatus()), // Status
                    checkString(d.getMethod()), // Method
                    checkDouble(d.getConfidence()), // Confidence
                    checkTime(d.getTimestamp()), // Timestamp
                    arrivalOffsetMinutes(d.getStartAt(), d.getTimestamp(), d.getStatus(), d.getMethod()), // Arrival
                                                                                                          // Offset (how
                                                                                                          // early/late)

                    // Session flag
                    String.valueOf(d.isOpen())));
        }

        String title = buildStudentTitle(summary); // only used for PDF
        generator.generate(title, headers, rows, out);
    }

    // Export session summary details using the given ReportGenerator
    public void exportSessionSummary(Long sessionId, ReportGenerator generator, OutputStream out) throws Exception {

        // Check if session exists
        Session session = sessionManager.getSession(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found: " + sessionId));

        // Retrieve fields from session
        Long sid = session.getId();
        String course = checkString(session.getCourseName());
        String rosterName = (session.getRoster() != null && session.getRoster().getName() != null)
                ? session.getRoster().getName()
                : ""; // Prevent null pointer exception if session created has not been assigned to a
                      // roster
        LocalDateTime start = session.getStartAt();
        LocalDateTime end = session.getEndAt();
        int lateAfterMin = session.getLateAfterMinutes() == null ? 15 : session.getLateAfterMinutes();

        // Retrieve headers
        List<String> headers = headersForSession();

        // Build rows to match the headers (retrieve students who have been marked
        // first, then the unmarked students)
        List<List<String>> rows = new ArrayList<>();

        // Build rows for marked students
        List<Attendance> attendanceList;
        try {
            attendanceList = attendanceManager.getAttendanceBySessionId(sessionId);
        } catch (NoSuchElementException e) {
            // If no attendance records are found for the session, use an empty list instead
            // of throwing an exception
            attendanceList = List.of();
        }
        Set<Long> markedStudents = new HashSet<>();

        for (Attendance a : attendanceList) {
            Student s = a.getStudent();
            if (s != null)
                markedStudents.add(s.getId());

            String arrivalOffset = arrivalOffsetMinutes(start, a.getTimestamp(), a.getStatus(), a.getMethod());

            rows.add(List.of(
                    // Student details
                    checkString(s != null ? s.getStudentId() : ""),
                    checkString(s != null ? s.getName() : ""),
                    course,

                    // Session fields
                    sid.toString(), // Session ID
                    rosterName, // Roster Name
                    checkTime(start), // Start Time
                    checkTime(end), // End Time
                    String.valueOf(lateAfterMin), // Late After (min)

                    // Attendance fields
                    checkString(a.getStatus()), // Status
                    checkString(a.getMethod()), // Method
                    checkDouble(a.getConfidence()), // Confidence
                    checkTime(a.getTimestamp()), // Timestamp
                    arrivalOffset, // Arrival Offset (min)
                    String.valueOf(session.isOpen())));
        }

        // Build rows for unmarked students
        if (session.getRoster() != null) {
            List<StudentRoster> rosterEntries = studentRosterRepository.findByRoster(session.getRoster());
            for (StudentRoster sr : rosterEntries) {
                Student s = sr.getStudent();
                if (s == null)
                    continue;
                if (markedStudents.contains(s.getId()))
                    continue;

                rows.add(List.of(
                        // Student details
                        checkString(s.getStudentId()),
                        checkString(s.getName()),
                        course,

                        // Session fields
                        sid.toString(), // Session ID
                        rosterName, // Roster Name
                        checkTime(start), // Start Time
                        checkTime(end), // End Time
                        String.valueOf(lateAfterMin), // Late After (min)

                        // Attendance fields (unmarked)
                        "UNMARKED", // Status
                        "NOT MARKED", // Method
                        "-", // Confidence
                        "-", // Timestamp
                        "-", // Arrival Offset (min)
                        String.valueOf(session.isOpen())));
            }
        }

        String title = buildSessionTitle(session); 
        generator.generate(title, headers, rows, out);
    }

    // Return headers for student attendance summary
    private List<String> headersForStudent() {
        return STUDENT_EXPORT_HEADERS;
    }

    // Return headers for session summary
    private List<String> headersForSession() {
        return SESSION_EXPORT_HEADERS;
    }

    private String buildStudentTitle(StudentAttendanceSummaryDTO summary) {
        return String.format("Student Attendance Summary - (%s | %s | %s)",
                checkString(summary.getStudentId()),
                checkString(summary.getName()),
                checkString(summary.getClassName()));
    }

    private String buildSessionTitle(Session session) {
        return String.format("Session Summary - (%s | Session %s | %s)",
                (session.getRoster() != null ? checkString(session.getRoster().getName()) : "-"),
                String.valueOf(session.getId()),
                checkTime(session.getStartAt()));
    }

    /*
     * Helper methods
     */

    // Returns "-" if the input string is null.
    private static String checkString(String s) {
        return s == null ? "-" : s;
    }

    // Converts a Double to string format.
    // Returns "-" if the value is null to indicate missing data.
    private static String checkDouble(Double d) {
        return d == null ? "-" : d.toString();
    }

    // Converts LocalDateTime to ISO string format.
    // Returns "-" if the timestamp is null to ensure consistent CSV output.
    private static String checkTime(LocalDateTime t) {
        return t == null ? "-" : t.toString();
    }

    // Calculates how early or late a student arrived compared to session start
    // time.
    // Returns:
    // - "<1 min early" or "<1 min late" for differences less than a minute
    // - "X min early" / "X min late" for differences over a minute
    // - "on time" if timestamps are identical
    // - "-" if timestamp is null or attendance is unmarked/unrecorded
    private static String arrivalOffsetMinutes(LocalDateTime start,
            LocalDateTime ts,
            String status,
            String method) {

        // Return "-" if timestamps are missing
        if (start == null || ts == null)
            return "-";

        // Skip offset calculation if attendance is pending or unmarked
        if ((status != null && (status.equalsIgnoreCase("PENDING")
                || status.equalsIgnoreCase("UNMARKED")))
                || (method != null && method.equalsIgnoreCase("NOT MARKED"))) {
            return "-";
        }

        // Compute total difference in seconds between start and timestamp
        long seconds = Duration.between(start, ts).getSeconds();

        // Return formatted string based on difference
        if (seconds == 0)
            return "on time";
        if (seconds > 0) {
            long mins = seconds / 60;
            return mins == 0 ? "<1 min late" : mins + " min late"; // if less than a minute late, return <1 min late,
                                                                   // else return the no. mins late
        } else {
            long mins = (-seconds) / 60;
            return mins == 0 ? "<1 min early" : mins + " min early"; // if less than a minute early, return <1 min
                                                                     // early, else return the no. mins early
        }
    }
}
