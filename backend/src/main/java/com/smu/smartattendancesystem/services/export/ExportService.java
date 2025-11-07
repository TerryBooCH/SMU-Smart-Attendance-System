package com.smu.smartattendancesystem.services.export;

import java.io.OutputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.smu.smartattendancesystem.dto.StudentAttendanceSummaryDTO;
import com.smu.smartattendancesystem.dto.StudentSessionAttendanceDTO;
import com.smu.smartattendancesystem.managers.RosterManager;
import com.smu.smartattendancesystem.managers.SessionManager;
import com.smu.smartattendancesystem.managers.StudentManager;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.services.ReportService;

@Service
public class ExportService {
    private ReportService reportService;
    private StudentManager studentManager;
    private SessionManager sessionManager;
    private RosterManager rosterManager;

    public ExportService(ReportService reportService,
            StudentManager studentManager,
            SessionManager sessionManager,
            RosterManager rosterManager) {
        this.reportService = reportService;
        this.studentManager = studentManager;
        this.sessionManager = sessionManager;
        this.rosterManager = rosterManager;
    }

    // Exports a student's attendance summary using the given ReportGenerator (CSV,
    // XLSX)
    public void exportStudentAttendance(String studentId, ReportGenerator generator, OutputStream out)
            throws Exception {

        // Retrieve student's attendance summary
        StudentAttendanceSummaryDTO summary = reportService.getStudentAttendanceSummary(studentId);
        List<StudentSessionAttendanceDTO> details = summary.getSessions();
        Student student = studentManager.getStudentByStudentId(studentId)
                .orElseThrow(() -> new NoSuchElementException("Student not found: " + studentId));

        // Pick headers by format (CSV/XLSX share; PDF can differ)
        List<String> headers = headersForStudent(generator.getFileExtension());

        // Build rows to match CSV/XLSX headers:
        // Name, Status, Method, Student ID, Class, Course, Email, Phone, Timestamp,
        // Action
        List<List<String>> rows = new ArrayList<>(details.size());
        for (StudentSessionAttendanceDTO d : details) {
            rows.add(List.of(
                    checkString(summary.getName()), // Name
                    checkString(d.getStatus()), // Status
                    checkString(d.getMethod()), // Method
                    checkString(summary.getStudentId()), // Student ID
                    checkString(summary.getClassName()), // Class
                    checkString(d.getCourseName()), // Course
                    checkString(student.getEmail()), // Email
                    checkString(student.getPhone()), // Phone
                    checkTime(d.getTimestamp()), // Timestamp
                    checkString(d.getStatus())));
        }

        generator.generate(headers, rows, out);
    }

    // Select header format based on export type
    private List<String> headersForStudent(String ext) {
        String e = ext == null ? "" : ext.toLowerCase();
        switch (e) {
            case "pdf":
                return List.of("Student ID", "Student Name", "Attendance Status",
                        "Recorded At", "Confidence Score", "Method", "Notes");
            case "xlsx":
            case "csv":
            default:
                return List.of("Name", "Status", "Method",
                        "Student ID", "Class", "Course", "Email", "Phone", "Timestamp", "Status");
        }
    }

    // Helpers to prevent NullPointerException
    // returns an empty string if null
    private static String checkString(String s) {
        return s == null ? "" : s;
    }

    // converts double to string, or return empty if null
    private static String checkDouble(Double d) {
        return d == null ? "" : d.toString();
    }

    // converts LocalDateTime to string, or return empty if null
    private static String checkTime(LocalDateTime t) {
        return t == null ? "" : t.toString();
    }
}
