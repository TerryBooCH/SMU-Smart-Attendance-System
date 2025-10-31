package com.smu.smartattendancesystem.managers;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.smu.smartattendancesystem.models.Attendance;
import com.smu.smartattendancesystem.repositories.AttendanceRepository;

@Service
public class AttendanceManager {
    private final AttendanceRepository attendanceRepository;

    public AttendanceManager(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    // CREATE: Mark attendance
    // Use case: when a student checks in (via face recognition)
    public Attendance markAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> saveAll(List<Attendance> attendances) {
        return attendanceRepository.saveAll(attendances);
    }

    // READ: Get attendance by ID
    // Use case: check one record
    public Optional<Attendance> getAttendance(Long id) {
        return attendanceRepository.findById(id);
    }

    // READ: List all attendance records
    // Use case: admin exporting all data
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    // UPDATE: Correct an attendance record
    // Use case: lecturer fixes mistaken absence
    public Attendance updateAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    // DELETE: Remove a record
    // Use case: invalid entry due to duplicate scan
    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }

    // Find all attendance records by session id
    public List<Attendance> getAttendanceBySessionId(Long sessionId) {
        return attendanceRepository.findBySession_Id(sessionId);
    }
}
