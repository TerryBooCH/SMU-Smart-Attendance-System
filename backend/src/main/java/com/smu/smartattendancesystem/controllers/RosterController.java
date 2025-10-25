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
import com.smu.smartattendancesystem.managers.AttendanceManager;
import com.smu.smartattendancesystem.managers.SessionManager;
import com.smu.smartattendancesystem.models.Attendance;
import com.smu.smartattendancesystem.models.Roster;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.models.Session;
import com.smu.smartattendancesystem.models.StudentRoster;
import com.smu.smartattendancesystem.services.RosterService;
import com.smu.smartattendancesystem.services.FaceDataService;
import com.smu.smartattendancesystem.utils.LoggerFacade;

@RestController
@RequestMapping("/api/rosters")
public class RosterController {

    private final RosterService rosterService;
    private final FaceDataService faceDataService;
    private final AttendanceManager attendanceManager;
    private final SessionManager sessionManager; 

    public RosterController(RosterService rosterService, FaceDataService faceDataService, AttendanceManager attendanceManager, SessionManager sessionManager) {
        this.rosterService = rosterService;
        this.faceDataService = faceDataService;
        this.attendanceManager = attendanceManager; 
        this.sessionManager = sessionManager;
    }

    // CREATE roster
    @PostMapping
    public ResponseEntity<?> createRoster(@RequestBody Roster roster) {
        try {
            Roster created = rosterService.createRoster(roster);
            LoggerFacade.info("Created Roster: " + created.getName() + " (ID: " + created.getId() + ").");
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            LoggerFacade.warning("Failed to create roster: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            LoggerFacade.warning("Conflict while creating roster: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while creating roster: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while creating the roster"));
        }
    }

    // READ all rosters
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

            LoggerFacade.info("Fetched all rosters (" + summaries.size() + " total).");
            return ResponseEntity.ok(summaries);
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while fetching rosters: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while retrieving rosters"));
        }
    }

    // READ specific roster
    @GetMapping("/{id}")
    public ResponseEntity<?> getRosterById(@PathVariable Long id) {
        try {
            Roster roster = rosterService.getRosterById(id);

            Map<String, Object> response = new HashMap<>();
            response.put("id", roster.getId());
            response.put("name", roster.getName());
            response.put("createdAt", roster.getCreatedAt());
            response.put("updatedAt", roster.getUpdatedAt());

            LoggerFacade.info("Fetched Roster (ID: " + id + ").");
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            LoggerFacade.warning("Roster not found: ID " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Roster not found with ID: " + id));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while fetching roster ID " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while retrieving the roster"));
        }
    }

    // DELETE roster
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoster(@PathVariable Long id) {
        try {
            rosterService.deleteRoster(id);
            LoggerFacade.info("Deleted Roster (ID: " + id + ").");
            return ResponseEntity.ok(createSuccessResponse("Roster deleted successfully"));
        } catch (NoSuchElementException e) {
            LoggerFacade.warning("Failed to delete — Roster not found: ID " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Roster not found with ID: " + id));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while deleting roster ID " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while deleting the roster"));
        }
    }

    // ADD student to roster
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

            // Auto-create attendance for linked sessions
            List<Session> linkedSessions = sessionManager.getSessionsByRosterId(rosterId);
            if (!linkedSessions.isEmpty()) {
                List<Attendance> attendances = linkedSessions.stream()
                        .map(session -> new Attendance(session, student, "PENDING", "NOT MARKED", null))
                        .toList();
                attendanceManager.saveAll(attendances);
            }

            List<FaceDataDTO> faceList = faceDataService.list(studentId);
            String latestFaceBase64 = faceList.isEmpty()
                    ? null
                    : faceList.get(faceList.size() - 1).getImageBase64();

            Map<String, Object> response = new HashMap<>();
            response.put("id", student.getId());
            response.put("studentId", student.getStudentId());
            response.put("name", student.getName());
            response.put("email", student.getEmail());
            response.put("phone", student.getPhone());
            response.put("studentClass", student.getClassName());
            response.put("imageBase64", latestFaceBase64);

            LoggerFacade.info("Added Student " + studentId + " to Roster (ID: " + rosterId + ").");
            return ResponseEntity.ok(response);

        } catch (NoSuchElementException e) {
            String msg = e.getMessage().toLowerCase();
            if (msg.contains("roster")) {
                LoggerFacade.warning("Failed to add Student " + studentId + " — Roster not found: ID " + rosterId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Roster not found with ID: " + rosterId));
            } else if (msg.contains("student")) {
                LoggerFacade.warning("Failed to add Student " + studentId + " — Student not found.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Student not found with ID: " + studentId));
            } else {
                LoggerFacade.warning("Failed to add Student " + studentId + " — Resource not found: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Resource not found: " + e.getMessage()));
            }
        } catch (IllegalStateException e) {
            LoggerFacade.warning("Conflict while adding Student " + studentId + " to Roster " + rosterId + ": already exists.");
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse("Student with ID " + studentId + " is already in this roster"));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while adding Student " + studentId + " to Roster " + rosterId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An unexpected error occurred while adding student to roster"));
        }
    }

    // REMOVE student from roster
    @DeleteMapping("/{rosterId}/students/{studentId}")
    public ResponseEntity<?> removeStudentFromRoster(@PathVariable Long rosterId, @PathVariable String studentId) {
        try {
            Roster updated = rosterService.removeStudentFromRoster(rosterId, studentId);
            LoggerFacade.info("Removed Student " + studentId + " from Roster (ID: " + rosterId + ").");
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            LoggerFacade.warning("Failed to remove Student " + studentId + " — " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while removing Student " + studentId + " from Roster " + rosterId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while removing student from roster"));
        }
    }

    // BULK update roster students
    @PutMapping("/{rosterId}/students")
    public ResponseEntity<?> updateRosterStudents(@PathVariable Long rosterId, @RequestBody List<String> studentIds) {
        try {
            Roster updated = rosterService.updateRosterStudents(rosterId, studentIds);
            LoggerFacade.info("Updated student list for Roster (ID: " + rosterId + ") with " + studentIds.size() + " students.");
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            LoggerFacade.warning("Failed to update students — Roster not found: ID " + rosterId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Roster not found with ID: " + rosterId));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while updating students for Roster " + rosterId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while updating roster students"));
        }
    }

    // READ all students in roster
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

                List<FaceDataDTO> faces = faceDataService.list(student.getStudentId());
                if (!faces.isEmpty()) {
                    FaceDataDTO latestFace = faces.get(faces.size() - 1);
                    studentMap.put("imageBase64", latestFace.getImageBase64());
                } else {
                    studentMap.put("imageBase64", "");
                }

                return studentMap;
            }).collect(Collectors.toList());

            LoggerFacade.info("Fetched " + response.size() + " students from Roster (ID: " + rosterId + ").");
            return ResponseEntity.ok(response);

        } catch (NoSuchElementException e) {
            LoggerFacade.warning("Roster not found while fetching students: ID " + rosterId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Roster not found with ID: " + rosterId));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while fetching students from Roster " + rosterId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while retrieving students in roster"));
        }
    }

    // UPDATE roster name
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRosterName(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String newName = request.get("name");
            Roster updated = rosterService.updateRosterName(id, newName);

            Map<String, Object> response = new HashMap<>();
            response.put("id", updated.getId());
            response.put("name", updated.getName());
            response.put("createdAt", updated.getCreatedAt());
            response.put("updatedAt", updated.getUpdatedAt());

            LoggerFacade.info("Updated name of Roster (ID: " + id + ") to \"" + newName + "\".");
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            LoggerFacade.warning("Failed to update name — Roster not found: ID " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Roster not found with ID: " + id));
        } catch (IllegalArgumentException e) {
            LoggerFacade.warning("Invalid roster name update for ID " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while updating roster name (ID: " + id + "): " + e.getMessage());
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
