package com.smu.smartattendancesystem.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.smu.smartattendancesystem.models.Roster;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.services.RosterService;

@RestController
@RequestMapping("/api/rosters")
public class RosterController {

    private final RosterService rosterService;

    public RosterController(RosterService rosterService) {
        this.rosterService = rosterService;
    }

    // ✅ Create a new roster
    @PostMapping
    public Roster createRoster(@RequestBody Roster roster) {
        return rosterService.createRoster(roster);
    }

    // ✅ Get all rosters
    @GetMapping
    public List<Roster> getAllRosters() {
        return rosterService.getAllRosters();
    }

    // ✅ Get specific roster by ID
    @GetMapping("/{id}")
    public Roster getRosterById(@PathVariable Long id) {
        return rosterService.getRosterById(id);
    }

    // ✅ Delete roster
    @DeleteMapping("/{id}")
    public void deleteRoster(@PathVariable Long id) {
        rosterService.deleteRoster(id);
    }

    // ✅ Add student to roster
    @PostMapping("/{rosterId}/students/{studentId}")
    public Roster addStudentToRoster(@PathVariable Long rosterId, @PathVariable Long studentId) {
        return rosterService.addStudentToRoster(rosterId, studentId);
    }

    // ✅ Remove student from roster
    @DeleteMapping("/{rosterId}/students/{studentId}")
    public Roster removeStudentFromRoster(@PathVariable Long rosterId, @PathVariable Long studentId) {
        return rosterService.removeStudentFromRoster(rosterId, studentId);
    }

    // ✅ Replace all students in a roster (bulk update)
    @PutMapping("/{rosterId}/students")
    public Roster updateRosterStudents(@PathVariable Long rosterId, @RequestBody List<Long> studentIds) {
        return rosterService.updateRosterStudents(rosterId, studentIds);
    }

    // ✅ Get all students in a roster
    @GetMapping("/{rosterId}/students")
    public List<Student> getStudentsInRoster(@PathVariable Long rosterId) {
        return rosterService.getRosterById(rosterId).getStudents();
    }
}
