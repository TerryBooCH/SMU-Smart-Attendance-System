package com.smu.smartattendancesystem.repositories;

import com.smu.smartattendancesystem.models.CourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {

    // Find all enrollments for a student
    List<CourseEnrollment> findByStudent_StudentId(String studentId);

    // Find all students enrolled in a course
    List<CourseEnrollment> findByCourse_CourseId(Long courseId);

    // Check if a student is already enrolled
    boolean existsByStudent_StudentIdAndCourse_CourseId(String studentId, Long courseId);
}
