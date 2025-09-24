package com.smu.smartattendancesystem.managers;

import com.smu.smartattendancesystem.models.Section;
import com.smu.smartattendancesystem.repositories.SectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SectionManager {
    private final SectionRepository sectionRepo;

    public SectionManager(SectionRepository sectionRepo) {
        this.sectionRepo = sectionRepo;
    }

    // CREATE: Create new section
    // Use case: admin defines tutorial/lab groups
    public Section addSection(Section section) {
        return sectionRepo.save(section);
    }

    // READ: Get section by ID
    // Use case: lecturer views section details
    public Optional<Section> getSection(Long id) {
        return sectionRepo.findById(id);
    }

    // READ: Get all sections
    // Use case: admin/lecturer needs full list
    public List<Section> getAllSections() {
        return sectionRepo.findAll();
    }

    // UPDATE: Update section info
    // Use case: rename section or reassign lecturer
    public Section updateSection(Section section) {
        return sectionRepo.save(section);
    }

    // DELETE: Remove a section
    // Use case: section merged/canceled
    public void deleteSection(Long id) {
        sectionRepo.deleteById(id);
    }
}
