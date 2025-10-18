package com.smu.smartattendancesystem.repositories;

import java.util.List;
import java.util.Optional;

import com.smu.smartattendancesystem.models.Student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByStudentId(String studentId);

    Optional<Student> findByEmail(String email);

    boolean existsByPhone(String phone);

    Optional<Student> findByName(String name);

    List<Student> findByNameContainingIgnoreCase(String name);

    // ✅ New: Find students by class name
    List<Student> findByClassNameIgnoreCase(String className);
}
