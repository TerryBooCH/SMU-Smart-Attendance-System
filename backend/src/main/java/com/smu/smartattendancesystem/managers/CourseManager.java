package com.smu.smartattendancesystem.managers;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.smu.smartattendancesystem.models.Course;
import com.smu.smartattendancesystem.services.CourseService;

/**
 * Manager class for Course operations.
 * Acts as a facade to simplify course management operations.
 * Delegates to CourseService for business logic.
 */
@Component
public class CourseManager {
    
    private final CourseService courseService;
    
    public CourseManager(CourseService courseService) {
        this.courseService = courseService;
    }
    
    // Add a new course
    public Course addCourse(Course course) {
        return courseService.createCourse(course);
    }
    
    // Get course by ID
    public Optional<Course> getCourse(Long id) {
        return courseService.getCourseById(id);
    }
    
    // Get course by code
    public Optional<Course> getCourseByCode(String code) {
        return courseService.getCourseByCode(code);
    }
    
    // List all courses
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }
    
    // Update course information
    public Course updateCourse(Long id, Course course) {
        return courseService.updateCourse(id, course);
    }
    
    // Remove a course
    public void deleteCourse(Long id) {
        courseService.deleteCourse(id);
    }
    
    // Check if course exists by ID
    public boolean courseExists(Long id) {
        return courseService.existsById(id);
    }
    
    // Check if course exists by code
    public boolean courseExistsByCode(String code) {
        return courseService.existsByCode(code);
    }
}