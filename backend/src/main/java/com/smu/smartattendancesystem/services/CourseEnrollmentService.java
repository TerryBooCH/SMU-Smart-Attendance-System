package com.smu.smartattendancesystem.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smu.smartattendancesystem.models.Course;
import com.smu.smartattendancesystem.models.CourseEnrollment;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.repositories.CourseEnrollmentRepository;
import com.smu.smartattendancesystem.repositories.CourseRepository;
import com.smu.smartattendancesystem.repositories.StudentRepository;

@Service
public class CourseEnrollmentService {
    
    private final CourseEnrollmentRepository enrollmentRepo;
    private final StudentRepository studentRepo;
    private final CourseRepository courseRepo;
    
    public CourseEnrollmentService(
            CourseEnrollmentRepository enrollmentRepo,
            StudentRepository studentRepo,
            CourseRepository courseRepo) {
        this.enrollmentRepo = enrollmentRepo;
        this.studentRepo = studentRepo;
        this.courseRepo = courseRepo;
    }
    
    /**
     * Enroll a student in a course
     * Validates that both student and course exist
     * Prevents duplicate enrollments
     */
    @Transactional
    public CourseEnrollment enrollStudent(String studentId, Long courseId) {
        // Validate student exists
        Student student = studentRepo.findByStudentId(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found: " + studentId));
        
        // Validate course exists
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));
        
        // Check for duplicate enrollment
        if (enrollmentRepo.existsByStudent_StudentIdAndCourse_Id(studentId, courseId)) {
            throw new IllegalStateException("Student " + studentId + " is already enrolled in course " + courseId);
        }
        
        // Create and save enrollment
        CourseEnrollment enrollment = new CourseEnrollment(course, student);
        return enrollmentRepo.save(enrollment);
    }
    
    /**
     * Get a specific enrollment by ID
     */
    public Optional<CourseEnrollment> getEnrollment(Long id) {
        return enrollmentRepo.findById(id);
    }
    
    /**
     * Get all enrollments in the system
     */
    public List<CourseEnrollment> getAllEnrollments() {
        return enrollmentRepo.findAll();
    }
    
    /**
     * Get all courses a student is enrolled in
     */
    public List<CourseEnrollment> getStudentEnrollments(String studentId) {
        return enrollmentRepo.findByStudent_StudentId(studentId);
    }
    
    /**
     * Get all students enrolled in a course (roster)
     */
    public List<CourseEnrollment> getCourseEnrollments(Long courseId) {
        return enrollmentRepo.findByCourse_Id(courseId);
    }
    
    /**
     * Unenroll a student from a course
     */
    @Transactional
    public void deleteEnrollment(Long enrollmentId) {
        if (!enrollmentRepo.existsById(enrollmentId)) {
            throw new IllegalArgumentException("Enrollment not found: " + enrollmentId);
        }
        enrollmentRepo.deleteById(enrollmentId);
    }
    
    /**
     * Check if a student is enrolled in a course
     */
    public boolean isStudentEnrolled(String studentId, Long courseId) {
        return enrollmentRepo.existsByStudent_StudentIdAndCourse_Id(studentId, courseId);
    }
}