package com.smu.smartattendancesystem.managers;

import com.smu.smartattendancesystem.models.Course;
import com.smu.smartattendancesystem.repositories.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseManager {
    private final CourseRepository courseRepo;

    public CourseManager(CourseRepository courseRepo) {
        this.courseRepo = courseRepo;
    }

    // CREATE: Add a new course
    // Use case: admin sets up new module
    public Course addCourse(Course course) {
        return courseRepo.save(course);
    }

    // READ: Get course by ID
    // Use case: student/lecturer views course details
    public Optional<Course> getCourse(Long id) {
        return courseRepo.findById(id);
    }

    // READ: List all courses
    // Use case: students browse available modules
    public List<Course> getAllCourses() {
        return courseRepo.findAll();
    }

    // UPDATE: Update course info
    // Use case: change course name or code
    public Course updateCourse(Course course) {
        return courseRepo.save(course);
    }

    // DELETE: Remove a course
    // Use case: course discontinued
    public void deleteCourse(Long id) {
        courseRepo.deleteById(id);
    }
}
