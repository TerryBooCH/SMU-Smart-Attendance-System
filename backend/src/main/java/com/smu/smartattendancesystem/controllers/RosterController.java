package com.smu.smartattendancesystem.controllers;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.smu.smartattendancesystem.dto.FaceDataDTO;
import com.smu.smartattendancesystem.dto.RosterSummaryDTO;
import com.smu.smartattendancesystem.models.Roster;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.models.StudentRoster;
import com.smu.smartattendancesystem.services.RosterService;
import com.smu.smartattendancesystem.services.FaceDataService;

@RestController
@RequestMapping("/api/rosters")
public class RosterController {

    private final RosterService rosterService;
    private final FaceDataService faceDataService;

    public RosterController(RosterService rosterService, FaceDataService faceDataService) {
        this.rosterService = rosterService;
        this.faceDataService = faceDataService;
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

            List<RosterSummaryDTO> summaries = rosters.stream()
                    .map(r -> new RosterSummaryDTO(
                            r.getId(),
                            r.getName(),
                            r.getCreatedAt(),
                            r.getUpdatedAt(),
                            (r.getStudentRosters() != null) ? r.getStudentRosters().size() : 0
                    ))
                    .toList();

            return ResponseEntity.ok(summaries);
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

            Map<String, Object> response = new HashMap<>();
            response.put("id", roster.getId());
            response.put("name", roster.getName());
            response.put("createdAt", roster.getCreatedAt());
            response.put("updatedAt", roster.getUpdatedAt());

            return ResponseEntity.ok(response);
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

            StudentRoster newStudentRoster = updated.getStudentRosters()
                    .stream()
                    .filter(sr -> sr.getStudent().getStudentId().equals(studentId))
                    .findFirst()
                    .orElseThrow(() -> new NoSuchElementException("Student not found after adding to roster"));

            Student student = newStudentRoster.getStudent();

            // Get latest face data (if available)
            List<FaceDataDTO> faceList = faceDataService.list(studentId);
            String latestFaceBase64 = faceList.isEmpty()
                    ? null
                    : faceList.get(faceList.size() - 1).getImageBase64();

            // Build response
            Map<String, Object> response = new HashMap<>();
            response.put("id", student.getId());
            response.put("studentId", student.getStudentId());
            response.put("name", student.getName());
            response.put("email", student.getEmail());
            response.put("phone", student.getPhone());
            response.put("studentClass", student.getClassName());
            response.put("imageBase64", latestFaceBase64);

            return ResponseEntity.ok(response);

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
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
            Roster roster = rosterService.getRosterById(rosterId);
            List<Student> students = roster.getStudents();

            List<Map<String, Object>> response = students.stream().map(student -> {
                Map<String, Object> studentMap = new LinkedHashMap<>();
                studentMap.put("id", student.getId());
                studentMap.put("createdAt", student.getCreatedAt());
                studentMap.put("updatedAt", student.getUpdatedAt());
                studentMap.put("studentId", student.getStudentId());
                studentMap.put("name", student.getName());
                studentMap.put("email", student.getEmail());
                studentMap.put("phone", student.getPhone());
                studentMap.put("studentClass", student.getClassName());

                // Get latest face data (if any)
                List<FaceDataDTO> faces = faceDataService.list(student.getStudentId());
                if (!faces.isEmpty()) {
                    FaceDataDTO latestFace = faces.get(faces.size() - 1);
                    studentMap.put("imageBase64", latestFace.getImageBase64());
                } else {
                    studentMap.put("imageBase64", "");
                }

                return studentMap;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(response);

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Roster not found with ID: " + rosterId));
        } catch (Exception e) {
            e.printStackTrace();
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

    // Helper methods
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
