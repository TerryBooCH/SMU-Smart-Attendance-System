package com.smu.smartattendancesystem.services.export;

import java.io.OutputStream;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.LinkedHashSet;
import java.util.function.*;

import org.springframework.stereotype.Service;

import com.smu.smartattendancesystem.dto.StudentAttendanceSummaryDTO;
import com.smu.smartattendancesystem.dto.StudentSessionAttendanceDTO;
import com.smu.smartattendancesystem.managers.AttendanceManager;
import com.smu.smartattendancesystem.repositories.StudentRosterRepository;
import com.smu.smartattendancesystem.managers.SessionManager;
import com.smu.smartattendancesystem.models.Attendance;
import com.smu.smartattendancesystem.models.Session;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.models.StudentRoster;
import com.smu.smartattendancesystem.services.ReportService;

@Service
public class ExportService {
    private ReportService reportService;
    private SessionManager sessionManager;
    private StudentRosterRepository studentRosterRepository;
    private AttendanceManager attendanceManager;

    public ExportService(ReportService reportService,
            SessionManager sessionManager,
            StudentRosterRepository studentRosterRepository,
            AttendanceManager attendanceManager) {
        this.reportService = reportService;
        this.sessionManager = sessionManager;
        this.studentRosterRepository = studentRosterRepository;
        this.attendanceManager = attendanceManager;
    }

    // Represents a single column in the report (header and how to extract the data
    // for the header)
    private enum Column {
        STUDENT_ID("Student ID", ctx -> ctx.studentId()),
        NAME("Name", ctx -> ctx.name()),
        CLASS_NAME("Class", ctx -> ctx.className()),
        SESSION_ID("Session ID", ctx -> String.valueOf(ctx.sessionId())),
        ROSTER_NAME("Roster Name", ctx -> nullSafe(ctx.rosterName())),
        START_TIME("Start Time", ctx -> nullTime(ctx.start())),
        END_TIME("End Time", ctx -> nullTime(ctx.end())),
        LATE_AFTER("Late After (min)", ctx -> String.valueOf(ctx.lateAfterMin())),
        STATUS("Status", ctx -> nullSafe(ctx.status())),
        METHOD("Method", ctx -> nullSafe(ctx.method())),
        CONFIDENCE("Confidence", ctx -> nullDouble(ctx.confidence())),
        TIMESTAMP("Timestamp", ctx -> nullTime(ctx.timestamp())),
        ARRIVAL_OFFSET("Arrival Offset (min)", ctx -> nullSafe(ctx.arrivalOffset())),
        OPEN("Open", ctx -> String.valueOf(ctx.open()));

        private final String header;
        private final Function<RowContext, String> extractor;

        Column(String header, Function<RowContext, String> extractor) {
            this.header = header;
            this.extractor = extractor;
        }

        String header() {
            return header;
        }

        String extract(RowContext ctx) {
            return extractor.apply(ctx);
        }
    }

    // Represents a single row of data in the exported file (record of possible
    // fields)
    private static record RowContext(
            String studentId, String name, String className,
            Long sessionId, String rosterName,
            LocalDateTime start, LocalDateTime end, int lateAfterMin,
            String status, String method, Double confidence,
            LocalDateTime timestamp, String arrivalOffset, boolean open) {
    }

    // Helpers used by Column extractors to handle null in output
    private static String nullSafe(String s) {
        return s == null ? "-" : s;
    }

    private static String nullDouble(Double d) {
        return d == null ? "-" : d.toString();
    }

    private static String nullTime(LocalDateTime t) {
        return t == null ? "-" : t.toString();
    }

    // The Builder pattern for Export Options
    // Allows users to decide what to include / exclude in the report, except for
    // mandatory columns
    public static final class Options {
        private final List<Column> columns;

        private Options(List<Column> cols) {
            this.columns = List.copyOf(cols);
        }

        public List<Column> columns() {
            return columns;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static final class Builder {
            private final LinkedHashSet<Column> set = new LinkedHashSet<>();

            public Builder() {
                // Set the mandatory columns
                set.add(Column.STUDENT_ID);
                set.add(Column.NAME);
                set.add(Column.CLASS_NAME);
                set.add(Column.SESSION_ID);
            }

            // Fields to include / exclude
            public Builder rosterName(boolean b) {
                return t(b, Column.ROSTER_NAME);
            }

            public Builder startTime(boolean b) {
                return t(b, Column.START_TIME);
            }

            public Builder endTime(boolean b) {
                return t(b, Column.END_TIME);
            }

            public Builder lateAfter(boolean b) {
                return t(b, Column.LATE_AFTER);
            }

            public Builder status(boolean b) {
                return t(b, Column.STATUS);
            }

            public Builder method(boolean b) {
                return t(b, Column.METHOD);
            }

            public Builder confidence(boolean b) {
                return t(b, Column.CONFIDENCE);
            }

            public Builder timestamp(boolean b) {
                return t(b, Column.TIMESTAMP);
            }

            public Builder arrivalOffset(boolean b) {
                return t(b, Column.ARRIVAL_OFFSET);
            }

            public Builder open(boolean b) {
                return t(b, Column.OPEN);
            }

            private Builder t(boolean include, Column c) {
                if (include)
                    set.add(c);
                else
                    set.remove(c);
                return this;
            }

            public Options build() {
                // Ensure mandatory columns are present
                if (!set.contains(Column.STUDENT_ID) || !set.contains(Column.NAME)
                        || !set.contains(Column.CLASS_NAME) || !set.contains(Column.SESSION_ID)) {
                    throw new IllegalStateException("Mandatory columns missing");
                }
                return new Options(new java.util.ArrayList<>(set));
            }
        }
    }

    // Export student's attendance summary
    public void exportStudentAttendance(String studentId, Options options,
            ReportGenerator generator, OutputStream out) throws Exception {

        StudentAttendanceSummaryDTO summary = reportService.getStudentAttendanceSummary(studentId);
        List<StudentSessionAttendanceDTO> details = summary.getSessions();

        // Retrieve headers from options
        List<String> headers = options.columns().stream().map(Column::header).toList();

        // Build a RowContext for each attendance record
        List<List<String>> rows = new ArrayList<>(details.size());
        for (StudentSessionAttendanceDTO d : details) {
            RowContext ctx = new RowContext(
                    // Student info
                    summary.getStudentId(),
                    summary.getName(),
                    summary.getClassName(),
                    // Session fields
                    d.getSessionId(),
                    d.getRosterName(),
                    d.getStartAt(),
                    d.getEndAt(),
                    d.getLateAfterMinutes(),
                    // Attendance fields
                    d.getStatus(),
                    d.getMethod(),
                    d.getConfidence(),
                    d.getTimestamp(),
                    arrivalOffsetMinutes(d.getStartAt(), d.getTimestamp(), d.getStatus(), d.getMethod()),
                    // Session flag
                    d.isOpen());
            List<String> row = new ArrayList<>(options.columns().size());
            for (Column c : options.columns())
                row.add(c.extract(ctx));
            rows.add(row);
        }

        String title = buildStudentTitle(summary); // Only used for PDF exports, CSV and XLSX will ignore it
        generator.generate(title, headers, rows, out);
    }

    // Export session summary details
    public void exportSessionSummary(Long sessionId, Options options,
            ReportGenerator generator, OutputStream out) throws Exception {

        // Check if session exists
        Session session = sessionManager.getSession(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found: " + sessionId));

        // Fetch all attendance records for the session
        List<Attendance> attendanceList;
        try {
            attendanceList = attendanceManager.getAttendanceBySessionId(sessionId);
        } catch (NoSuchElementException e) {
            attendanceList = List.of();
        }

        // Build rows for marked students
        List<List<String>> rows = new ArrayList<>();

        Set<Long> marked = new HashSet<>();
        for (Attendance a : attendanceList) {
            Student s = a.getStudent();
            if (s != null)
                marked.add(s.getId());
            RowContext ctx = new RowContext(
                    s != null ? s.getStudentId() : "-",
                    s != null ? s.getName() : "-",
                    session.getCourseName(), // you used course in that column slot
                    session.getId(),
                    session.getRoster() != null ? session.getRoster().getName() : null,
                    session.getStartAt(),
                    session.getEndAt(),
                    session.getLateAfterMinutes() == null ? 15 : session.getLateAfterMinutes(),
                    a.getStatus(),
                    a.getMethod(),
                    a.getConfidence(),
                    a.getTimestamp(),
                    arrivalOffsetMinutes(session.getStartAt(), a.getTimestamp(), a.getStatus(), a.getMethod()),
                    session.isOpen());
            rows.add(projectRow(ctx, options));
        }
        // Build rows for unmarked students
        if (session.getRoster() != null) {
            for (StudentRoster sr : studentRosterRepository.findByRoster(session.getRoster())) {
                Student s = sr.getStudent();
                if (s == null || marked.contains(s.getId()))
                    continue;
                RowContext ctx = new RowContext(
                        s.getStudentId(), s.getName(), session.getCourseName(),
                        session.getId(),
                        session.getRoster().getName(),
                        session.getStartAt(),
                        session.getEndAt(),
                        session.getLateAfterMinutes() == null ? 15 : session.getLateAfterMinutes(),
                        "UNMARKED", "NOT MARKED", null, null, "-", session.isOpen());
                rows.add(projectRow(ctx, options));
            }
        }
        // Generate the report
        List<String> headers = options.columns().stream().map(Column::header).toList();
        String title = buildSessionTitle(session);
        generator.generate(title, headers, rows, out);
    }

    // Projects only the selected columns from the RowContext to a list of strings,
    // to be exported as a row in the report
    private List<String> projectRow(RowContext ctx, Options options) {
        List<String> row = new ArrayList<>(options.columns().size());
        for (Column c : options.columns())
            row.add(c.extract(ctx));
        return row;
    }

    // Build title for student attendance report (used in PDF exports)
    private String buildStudentTitle(StudentAttendanceSummaryDTO summary) {
        return String.format("Student Attendance Summary - (%s | %s | %s)",
                checkString(summary.getStudentId()),
                checkString(summary.getName()),
                checkString(summary.getClassName()));
    }

    // Build title for session summary reports (used in PDF exports)
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
