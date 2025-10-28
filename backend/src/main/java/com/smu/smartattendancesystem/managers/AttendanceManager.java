package com.smu.smartattendancesystem.managers;

import com.smu.smartattendancesystem.models.Attendance;
import com.smu.smartattendancesystem.repositories.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class AttendanceManager {
    private final AttendanceRepository attendanceRepository;

    public AttendanceManager(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    // CREATE: Mark attendance
    public Attendance markAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }
    
    public List<Attendance> saveAll(List<Attendance> attendances) {
        return attendanceRepository.saveAll(attendances);
    }

    // READ: Get attendance by ID
    public Optional<Attendance> getAttendance(Long id) {
        return attendanceRepository.findById(id);
    }

    // READ: List all attendance records
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    // READ: Get attendance by session ID
    public List<Attendance> getAttendanceBySessionId(Long sessionId) {
        List<Attendance> attendances = attendanceRepository.findBySessionId(sessionId);
        if (attendances.isEmpty()) {
            throw new NoSuchElementException("No attendance records found for session ID: " + sessionId);
        }
        return attendances;
    }

    // UPDATE: Update attendance status
    public Attendance updateAttendanceStatus(Long attendanceId, String status, String method) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new NoSuchElementException("Attendance record not found with ID: " + attendanceId));
        
        // Validate status
        if (!isValidStatus(status)) {
            throw new IllegalArgumentException("Invalid attendance status: " + status);
        }
        
        // Validate method
        if (!isValidMethod(method)) {
            throw new IllegalArgumentException("Invalid method: " + method);
        }

        // Check for conflicts (e.g., trying to update a closed session's attendance)
        if (!attendance.getSession().isOpen()) {
            throw new IllegalStateException("Cannot update attendance for a closed session");
        }
        
        attendance.setStatus(status);
        attendance.setMethod(method);
        
        return attendanceRepository.save(attendance);
    }

    // UPDATE: Update attendance status by session and student internal IDs (works even when session is closed)
    public Attendance updateAttendanceStatusBySessionAndStudent(Long sessionId, Long studentInternalId, String status, String method, Double confidence) {
        // Find attendance by session and student internal ID
        Attendance attendance = attendanceRepository.findBySessionIdAndStudentId(sessionId, studentInternalId)
                .orElseThrow(() -> new NoSuchElementException("Attendance record not found for session ID: " + sessionId + " and student internal ID: " + studentInternalId));
        
        // Validate status
        if (!isValidStatus(status)) {
            throw new IllegalArgumentException("Invalid attendance status: " + status);
        }
        
        // Validate method
        if (!isValidMethod(method)) {
            throw new IllegalArgumentException("Invalid method: " + method);
        }
        
        // NOTE: Removed session open validation to allow updates even when session is closed
        
        attendance.setStatus(status);
        attendance.setMethod(method);
        attendance.setConfidence(confidence); // This will be null for MANUAL method
        
        return attendanceRepository.save(attendance);
    }

    // UPDATE: Correct an attendance record
    public Attendance updateAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    // DELETE: Remove a record
    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }

    private boolean isValidStatus(String status) {
        return status != null && 
               (status.equals("PENDING") || status.equals("PRESENT") || 
                status.equals("ABSENT") || status.equals("LATE"));
    }

    private boolean isValidMethod(String method) {
        return method != null && 
               (method.equals("AUTO") || method.equals("MANUAL") || 
                method.equals("NOT MARKED"));
    }
}