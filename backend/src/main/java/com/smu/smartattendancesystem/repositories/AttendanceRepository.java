package com.smu.smartattendancesystem.repositories;

import com.smu.smartattendancesystem.models.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    // Find all attendance records for a given session
    List<Attendance> findBySession_SessionId(Long sessionId);

    // Find all attendance records for a given student
    List<Attendance> findByStudent_StudentId(String studentId);

    // Check if a student already has attendance for a session
    boolean existsByStudent_StudentIdAndSession_Id(String studentId, Long sessionId);
}
