package com.smu.smartattendancesystem.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smu.smartattendancesystem.models.Attendance;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findBySessionId(Long sessionId);

    List<Attendance> findByStudentId(Long studentId);

    List<Attendance> findByStudentIdAndSessionIdIn(Long studentId, List<Long> sessionIds);

    Optional<Attendance> findBySessionIdAndStudentId(Long sessionId, Long studentId);

    boolean existsBySessionIdAndStudentId(Long sessionId, Long studentId);
}