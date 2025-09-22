package com.smu.smartattendancesystem.repositories;

import com.smu.smartattendancesystem.models.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    // Find attendance by session
    List<Attendance> findBySession_SessionId(Long sessionId);

    // Find attendance by student
    List<Attendance> findByStudent_StudentId(String studentId);

    // Check if a student is already marked in a session
    boolean existsByStudent_StudentIdAndSession_SessionId(String studentId, Long sessionId);
}
