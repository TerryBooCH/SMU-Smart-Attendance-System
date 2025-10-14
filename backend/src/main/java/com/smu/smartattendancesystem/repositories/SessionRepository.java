package com.smu.smartattendancesystem.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smu.smartattendancesystem.models.Session;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    // Find sessions by course name
    List<Session> findByCourseName(String courseName);

    // Find sessions on a specific date
    List<Session> findByStartAt(LocalDate date);
}
