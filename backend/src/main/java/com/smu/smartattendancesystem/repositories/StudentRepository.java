package com.smu.smartattendancesystem.repositories;

import com.smu.smartattendancesystem.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByStudentId(String studentId);

    // Find student by email (useful for login / duplicate check)
    Optional<Student> findByEmail(String email); // Optional<Student>: May or may not contain a Student object (Avoids null error)

    // Check if student exists by phone (avoid duplicates)
    boolean existsByPhone(String phone);

    // Search student by name (for UI search table)
    Optional<Student> findByName(String name);
}
