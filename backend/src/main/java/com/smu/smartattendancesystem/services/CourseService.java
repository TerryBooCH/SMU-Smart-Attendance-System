package com.smu.smartattendancesystem.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smu.smartattendancesystem.models.Course;
import com.smu.smartattendancesystem.repositories.CourseRepository;

/**
 * Service layer for Course operations.
 * Handles business logic and validation.
 * Follows Single Responsibility Principle.
 */
@Service
@Transactional
public class CourseService {
    
    private final CourseRepository courseRepository;
    
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }
    
    /**
     * Create a new course.
     * Validates that course code is unique.
     * param course the course to create
     * return the created course
     * throws IllegalArgumentException if course code already exists
     */
    public Course createCourse(Course course) {
        if (course.getCode() == null || course.getCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Course code cannot be empty");
        }
        
        if (course.getTitle() == null || course.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Course title cannot be empty");
        }
        
        if (courseRepository.existsByCode(course.getCode())) {
            throw new IllegalArgumentException("Course code already exists: " + course.getCode());
        }
        
        return courseRepository.save(course);
    }
    
    /**
     * Get course by ID.
     * param id the course ID
     * return Optional containing the course if found
     */
    @Transactional(readOnly = true)
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }
    
    /**
     * Get course by code.
     * param code the course code
     * return Optional containing the course if found
     */
    @Transactional(readOnly = true)
    public Optional<Course> getCourseByCode(String code) {
        return courseRepository.findByCode(code);
    }
    
    /**
     * Get all courses.
     * return list of all courses
     */
    @Transactional(readOnly = true)
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    /**
     * Update an existing course.
     * param id the course ID to update
     * param updatedCourse the updated course data
     * return the updated course
     * throws IllegalArgumentException if course not found or code already exists
     */
    public Course updateCourse(Long id, Course updatedCourse) {
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + id));
        
        // Check if code is being changed and if new code already exists
        if (!existingCourse.getCode().equals(updatedCourse.getCode())) {
            if (courseRepository.existsByCode(updatedCourse.getCode())) {
                throw new IllegalArgumentException("Course code already exists: " + updatedCourse.getCode());
            }
        }
        
        // Validate fields
        if (updatedCourse.getCode() == null || updatedCourse.getCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Course code cannot be empty");
        }
        
        if (updatedCourse.getTitle() == null || updatedCourse.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Course title cannot be empty");
        }
        
        // Update fields
        existingCourse.setCode(updatedCourse.getCode());
        existingCourse.setTitle(updatedCourse.getTitle());
        
        return courseRepository.save(existingCourse);
    }
    
    /**
     * Delete a course by ID.
     * param id the course ID to delete
     * throws IllegalArgumentException if course not found
     */
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new IllegalArgumentException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }
    
    /**
     * Check if a course exists by ID.
     * param id the course ID
     * return true if exists, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return courseRepository.existsById(id);
    }
    
    /**
     * Check if a course exists by code.
     * param code the course code
     * return true if exists, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean existsByCode(String code) {
        return courseRepository.existsByCode(code);
    }
}