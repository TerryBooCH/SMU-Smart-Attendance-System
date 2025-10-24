package com.smu.smartattendancesystem.services;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.smu.smartattendancesystem.managers.RosterManager;
import com.smu.smartattendancesystem.models.Roster;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.models.Session;
import com.smu.smartattendancesystem.repositories.StudentRepository;
import com.smu.smartattendancesystem.repositories.SessionRepository;

@Service
public class RosterService {

    private final RosterManager rosterManager;
    private final StudentRepository studentRepository;
    private final SessionRepository sessionRepository;

    public RosterService(RosterManager rosterManager, StudentRepository studentRepository, SessionRepository sessionRepository) {
        this.rosterManager = rosterManager;
        this.studentRepository = studentRepository;
        this.sessionRepository = sessionRepository;
    }

    // Create a new roster
    public Roster createRoster(Roster roster) {
        return rosterManager.createRoster(roster);
    }

    // Get all rosters
    public List<Roster> getAllRosters() {
        return rosterManager.getAllRosters();
    }

    // Get roster by ID
    public Roster getRosterById(Long id) {
        return rosterManager.getRoster(id)
                .orElseThrow(() -> new RuntimeException("Roster not found with ID: " + id));
    }

    // Delete roster
    public void deleteRoster(Long id) {
        rosterManager.deleteRoster(id);
    }

    // \Update roster name by ID
    public Roster updateRosterName(Long rosterId, String newName) {
        if (newName == null || newName.trim().isEmpty()) {
            throw new IllegalArgumentException("Roster name cannot be empty");
        }

        Roster roster = rosterManager.getRoster(rosterId)
                .orElseThrow(() -> new NoSuchElementException("Roster not found with ID: " + rosterId));

        roster.setName(newName);
        return rosterManager.updateRoster(roster);
    }

    // Add student to roster
    public Roster addStudentToRoster(Long rosterId, String studentId) {
        // Fetch roster using RosterManager
        Roster roster = rosterManager.getRoster(rosterId)
                .orElseThrow(() -> new NoSuchElementException("Roster not found with ID: " + rosterId));

        // Fetch student (throws NoSuchElementException if not found)
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new NoSuchElementException("Student not found with studentId: " + studentId));

        // Check if student already in roster
        boolean alreadyInRoster = roster.getStudentRosters().stream()
                .anyMatch(sr -> sr.getStudent().getStudentId().equals(studentId));
        if (alreadyInRoster) {
            throw new IllegalStateException(
                    "Student with ID " + studentId + " is already in roster \"" + roster.getName() + "\"");
        }

        // Add to roster
        boolean added = roster.addToRoster(student);
        if (!added) {
            throw new IllegalStateException(
                    "Failed to add student to roster \"" + roster.getName() + "\" — possible invalid state");
        }

        // Save and return updated roster
        return rosterManager.updateRoster(roster);
    }

    // Remove student from roster
    public Roster removeStudentFromRoster(Long rosterId, String studentId) {
        Roster roster = getRosterById(rosterId);
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with studentId: " + studentId));

        boolean removed = roster.removeFromRoster(student.getId());
        if (!removed) {
            throw new RuntimeException("Student not found in roster");
        }

        return rosterManager.updateRoster(roster);
    }

    // Update all students in roster
    public Roster updateRosterStudents(Long rosterId, List<String> studentIds) {
        Roster roster = getRosterById(rosterId);

        roster.clearRoster();
        for (String studentId : studentIds) {
            Student student = studentRepository.findByStudentId(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));
            roster.addToRoster(student);
        }

        return rosterManager.updateRoster(roster);
    }

    public List<Session> getSessionsForRoster(Long rosterId) {
        return sessionRepository.findByRosterId(rosterId);
    }
}