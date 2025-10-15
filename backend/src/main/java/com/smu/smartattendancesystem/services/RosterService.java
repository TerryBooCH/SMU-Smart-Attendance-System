package com.smu.smartattendancesystem.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smu.smartattendancesystem.managers.RosterManager;
import com.smu.smartattendancesystem.models.Roster;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.repositories.StudentRepository;

@Service
public class RosterService {

    private final RosterManager rosterManager;
    private final StudentRepository studentRepository;

    public RosterService(RosterManager rosterManager, StudentRepository studentRepository) {
        this.rosterManager = rosterManager;
        this.studentRepository = studentRepository;
    }

    // ✅ Create a new roster
    public Roster createRoster(Roster roster) {
        return rosterManager.createRoster(roster);
    }

    // ✅ Get all rosters
    public List<Roster> getAllRosters() {
        return rosterManager.getAllRosters();
    }

    // ✅ Get roster by ID
    public Roster getRosterById(Long id) {
        return rosterManager.getRoster(id)
                .orElseThrow(() -> new RuntimeException("Roster not found with ID: " + id));
    }

    // ✅ Delete roster
    public void deleteRoster(Long id) {
        rosterManager.deleteRoster(id);
    }

    // ✅ Add student to roster
    public Roster addStudentToRoster(Long rosterId, Long studentId) {
        Roster roster = getRosterById(rosterId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));

        boolean added = roster.addToRoster(student);
        if (!added) {
            throw new RuntimeException("Student already in roster or invalid");
        }

        return rosterManager.updateRoster(roster);
    }

    // ✅ Remove student from roster
    public Roster removeStudentFromRoster(Long rosterId, Long studentId) {
        Roster roster = getRosterById(rosterId);

        boolean removed = roster.removeFromRoster(studentId);
        if (!removed) {
            throw new RuntimeException("Student not found in roster");
        }

        return rosterManager.updateRoster(roster);
    }

    // ✅ Update all students in roster
    public Roster updateRosterStudents(Long rosterId, List<Long> studentIds) {
        Roster roster = getRosterById(rosterId);

        roster.clearRoster();
        for (Long studentId : studentIds) {
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));
            roster.addToRoster(student);
        }

        return rosterManager.updateRoster(roster);
    }
}