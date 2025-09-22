package com.smu.smartattendancesystem.repositories;

import com.smu.smartattendancesystem.models.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // Find course by course code
    Course findByCourseCode(String courseCode);
}
