package com.smu.smartattendancesystem.repositories;

import com.smu.smartattendancesystem.models.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {

    // Find all sections for a course
    List<Section> findByCourse_CourseId(Long courseId);

    // Find a section by its code (useful for UI search)
    Section findBySectionCode(String sectionCode);
}
