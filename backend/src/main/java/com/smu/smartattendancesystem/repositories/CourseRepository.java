package com.smu.smartattendancesystem.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smu.smartattendancesystem.models.Course;

/**
 * Repository interface for Course entity.
 * Provides database access methods following Repository pattern.
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    // Find course by course code (unique identifier)
    Optional<Course> findByCode(String code);
    
    // Check if a course exists by code
    boolean existsByCode(String code);
    
    // Find course by title (case-insensitive)
    Optional<Course> findByTitleIgnoreCase(String title);
}