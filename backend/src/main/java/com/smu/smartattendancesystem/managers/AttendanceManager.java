package com.smu.smartattendancesystem.managers;

import com.smu.smartattendancesystem.models.Attendance;
import com.smu.smartattendancesystem.repositories.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AttendanceManager {
    private final AttendanceRepository attendanceRepo;

    public AttendanceManager(AttendanceRepository attendanceRepo) {
        this.attendanceRepo = attendanceRepo;
    }

    // CREATE: Mark attendance
    // Use case: when a student checks in (via face recognition)
    public Attendance markAttendance(Attendance attendance) {
        return attendanceRepo.save(attendance);
    }

    // READ: Get attendance by ID
    // Use case: check one record
    public Optional<Attendance> getAttendance(Long id) {
        return attendanceRepo.findById(id);
    }

    // READ: List all attendance records
    // Use case: admin exporting all data
    public List<Attendance> getAllAttendance() {
        return attendanceRepo.findAll();
    }

    // UPDATE: Correct an attendance record
    // Use case: lecturer fixes mistaken absence
    public Attendance updateAttendance(Attendance attendance) {
        return attendanceRepo.save(attendance);
    }

    // DELETE: Remove a record
    // Use case: invalid entry due to duplicate scan
    public void deleteAttendance(Long id) {
        attendanceRepo.deleteById(id);
    }
}
