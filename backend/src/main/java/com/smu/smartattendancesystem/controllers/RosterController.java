package com.smu.smartattendancesystem.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // Create a new roster
    @PostMapping
    public ResponseEntity<?> createRoster(@RequestBody Roster roster) {
        try {
            Roster created = rosterService.createRoster(roster);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while creating the roster"));
        }
    }

    // Get all rosters
    @GetMapping
    public ResponseEntity<?> getAllRosters() {
        try {
            List<Roster> rosters = rosterService.getAllRosters();
            return ResponseEntity.ok(rosters);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while retrieving rosters"));
        }
    }

    // Get specific roster by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getRosterById(@PathVariable Long id) {
        try {
            Roster roster = rosterService.getRosterById(id);
            return ResponseEntity.ok(roster);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Roster not found with ID: " + id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while retrieving the roster"));
        }
    }

    // Delete roster
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoster(@PathVariable Long id) {
        try {
            rosterService.deleteRoster(id);
            return ResponseEntity.ok(createSuccessResponse("Roster deleted successfully"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Roster not found with ID: " + id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while deleting the roster"));
        }
    }

    // Add student to roster
    @PostMapping("/{rosterId}/students/{studentId}")
    public ResponseEntity<?> addStudentToRoster(@PathVariable Long rosterId, @PathVariable String studentId) {
        try {
            Roster updated = rosterService.addStudentToRoster(rosterId, studentId);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while adding student to roster"));
        }
    }

    // Remove student from roster
    @DeleteMapping("/{rosterId}/students/{studentId}")
    public ResponseEntity<?> removeStudentFromRoster(@PathVariable Long rosterId, @PathVariable String studentId) {
        try {
            Roster updated = rosterService.removeStudentFromRoster(rosterId, studentId);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while removing student from roster"));
        }
    }

    // Replace all students in a roster (bulk update)
    @PutMapping("/{rosterId}/students")
    public ResponseEntity<?> updateRosterStudents(@PathVariable Long rosterId, @RequestBody List<String> studentIds) {
        try {
            Roster updated = rosterService.updateRosterStudents(rosterId, studentIds);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Roster not found with ID: " + rosterId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while updating roster students"));
        }
    }

    // Get all students in a roster
    @GetMapping("/{rosterId}/students")
    public ResponseEntity<?> getStudentsInRoster(@PathVariable Long rosterId) {
        try {
            List<Student> students = rosterService.getRosterById(rosterId).getStudents();
            return ResponseEntity.ok(students);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Roster not found with ID: " + rosterId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while retrieving students in roster"));
        }
    }

    // Update roster name by ID
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRosterName(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String newName = request.get("name");
            Roster updated = rosterService.updateRosterName(id, newName);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Roster not found with ID: " + id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while updating roster name"));
        }
    }

    // Helper methods for standardized responses
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", message);
        response.put("status", "error");
        return response;
    }

    private Map<String, String> createSuccessResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        response.put("status", "success");
        return response;
    }
}
