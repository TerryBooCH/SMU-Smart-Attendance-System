package com.smu.smartattendancesystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smu.smartattendancesystem.models.Student;

public interface StudentRepository extends JpaRepository<Student, String> {
    // String = type of primary key (studentId)
}
