package com.smu.smartattendancesystem.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smu.smartattendancesystem.models.CourseEnrollment;

@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {

    // Find all enrollments for a student
    List<CourseEnrollment> findByStudent_StudentId(String studentId);

    // Find all students enrolled in a course
    List<CourseEnrollment> findByCourse_Id(Long courseId);

    // Check if a student is already enrolled
    boolean existsByStudent_StudentIdAndCourse_Id(String studentId, Long courseId);
}
