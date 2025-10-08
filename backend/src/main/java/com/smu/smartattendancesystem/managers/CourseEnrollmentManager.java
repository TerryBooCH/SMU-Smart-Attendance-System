package com.smu.smartattendancesystem.managers;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.smu.smartattendancesystem.models.CourseEnrollment;
import com.smu.smartattendancesystem.repositories.CourseEnrollmentRepository;

@Service
public class CourseEnrollmentManager {
    private final CourseEnrollmentRepository enrollmentRepo;

    public CourseEnrollmentManager(CourseEnrollmentRepository enrollmentRepo) {
        this.enrollmentRepo = enrollmentRepo;
    }

    // CREATE: Enroll a student in a course
    // Use case: registration system
    public CourseEnrollment enrollStudent(CourseEnrollment enrollment) {
        return enrollmentRepo.save(enrollment);
    }

    // READ: Get enrollment by ID
    public Optional<CourseEnrollment> getEnrollment(Long id) {
        return enrollmentRepo.findById(id);
    }

    // READ: List all enrollments
    // Use case: admin viewing all links between students & courses
    public List<CourseEnrollment> getAllEnrollments() {
        return enrollmentRepo.findAll();
    }

    // UPDATE: Change enrollment info
    // Use case: transfer student to new section
    public CourseEnrollment updateEnrollment(CourseEnrollment enrollment) {
        return enrollmentRepo.save(enrollment);
    }

    // DELETE: Unenroll student
    // Use case: drop course
    public void deleteEnrollment(Long id) {
        enrollmentRepo.deleteById(id);
    }
}
