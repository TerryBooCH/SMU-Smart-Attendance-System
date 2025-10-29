package com.smu.smartattendancesystem.controllers;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.smu.smartattendancesystem.dto.SessionDTO;
import com.smu.smartattendancesystem.managers.RosterManager;
import com.smu.smartattendancesystem.managers.SessionManager;
import com.smu.smartattendancesystem.managers.AttendanceManager;
import com.smu.smartattendancesystem.models.Attendance;
import com.smu.smartattendancesystem.models.Roster;
import com.smu.smartattendancesystem.models.Session;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.utils.LoggerFacade;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionManager sessionManager;
    private final RosterManager rosterManager;
    private final AttendanceManager attendanceManager;

    public SessionController(SessionManager sessionManager, RosterManager rosterManager, AttendanceManager attendanceManager) {
        this.sessionManager = sessionManager;
        this.rosterManager = rosterManager;
        this.attendanceManager = attendanceManager;
    }

    // Create a new session
    @PostMapping
    public ResponseEntity<?> createSession(@RequestBody Session session) {
        try {
            if (session.getCourseName() == null || session.getCourseName().isBlank()) {
                throw new IllegalArgumentException("Course name is required");
            }

            if (session.getStartAt() == null) {
                session.setStartAt(LocalDateTime.now());
            }

            // Load roster if provided
            if (session.getRoster() != null && session.getRoster().getId() != null) {
                Roster roster = rosterManager.getRoster(session.getRoster().getId())
                        .orElseThrow(() -> new EntityNotFoundException("Roster not found with ID: " + session.getRoster().getId()));
                session.setRoster(roster);
            }

            // Save session first
            Session savedSession = sessionManager.createSession(session);

            // After session is saved, create Attendance records for roster students
            if (savedSession.getRoster() != null) {
                List<Student> students = savedSession.getRoster().getStudents();

                if (!students.isEmpty()) {
                    List<Attendance> attendances = students.stream()
                            .map(student -> new Attendance(savedSession, student, "PENDING", "NOT MARKED", null))
                            .toList();

                    attendanceManager.saveAll(attendances);
                    LoggerFacade.info("Initialized attendance for " + students.size() + " students in session " + savedSession.getId() + ".");
                }
            }

            LoggerFacade.info("Created Session " + savedSession.getId() + " titled: " + savedSession.getCourseName());
            return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(savedSession));

        } catch (EntityNotFoundException e) {
            LoggerFacade.warning("Failed to create session: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            LoggerFacade.warning("Invalid session creation request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (DataIntegrityViolationException e) {
            LoggerFacade.warning("Data integrity violation while creating session: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse("Database constraint violated"));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while creating session: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An unexpected error occurred while creating the session"));
        }
    }

    // Get all sessions
    @GetMapping
    public ResponseEntity<?> getAllSessions() {
        try {
            List<SessionDTO> sessions = sessionManager.getAllSessions()
                    .stream()
                    .map(this::toDTO)
                    .toList();

            LoggerFacade.info("Fetched all sessions. Total count: " + sessions.size());
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while fetching all sessions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while retrieving sessions"));
        }
    }

    // Get session by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSessionById(@PathVariable Long id) {
        try {
            Session session = sessionManager.getSession(id)
                    .orElseThrow(() -> new EntityNotFoundException("Session not found with ID: " + id));

            LoggerFacade.info("Fetched Session " + id + ".");
            return ResponseEntity.ok(toDTO(session));
        } catch (EntityNotFoundException e) {
            LoggerFacade.warning("Session not found: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while fetching session " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while retrieving the session"));
        }
    }

    // Open session
    @PutMapping("/{id}/open")
    public ResponseEntity<?> openSession(@PathVariable Long id) {
        try {
            Session session = sessionManager.getSession(id)
                    .orElseThrow(() -> new EntityNotFoundException("Session not found with ID: " + id));

            session.setOpen(true);
            Session updated = sessionManager.updateSession(session);
            LoggerFacade.info("Opened Session " + id + ".");
            return ResponseEntity.ok(toDTO(updated));
        } catch (EntityNotFoundException e) {
            LoggerFacade.warning("Failed to open — Session not found: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            LoggerFacade.warning("Conflict while opening Session " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while opening session " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while opening the session"));
        }
    }

    // Close session
    @PutMapping("/{id}/close")
    public ResponseEntity<?> closeSession(@PathVariable Long id) {
        try {
            Session session = sessionManager.getSession(id)
                    .orElseThrow(() -> new EntityNotFoundException("Session not found with ID: " + id));

            session.setOpen(false);
            Session updated = sessionManager.updateSession(session);
            LoggerFacade.info("Closed Session " + id + ".");
            return ResponseEntity.ok(toDTO(updated));
        } catch (EntityNotFoundException e) {
            LoggerFacade.warning("Failed to close — Session not found: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            LoggerFacade.warning("Conflict while closing Session " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while closing session " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while closing the session"));
        }
    }

    // Delete session
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Long id) {
        try {
            Session session = sessionManager.getSession(id)
                    .orElseThrow(() -> new EntityNotFoundException("Session not found with ID: " + id));

            if (session.isOpen()) {
                throw new IllegalStateException("Cannot delete an active session");
            }

            sessionManager.deleteSession(id);
            LoggerFacade.info("Deleted Session " + id + ".");
            return ResponseEntity.ok(createSuccessResponse("Session deleted successfully"));
        } catch (EntityNotFoundException e) {
            LoggerFacade.warning("Failed to delete — Session not found: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            LoggerFacade.warning("Conflict while deleting Session " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while deleting session " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while deleting the session"));
        }
    }

    // Link roster to session
    @PutMapping("/{id}/roster/{rosterId}")
    public ResponseEntity<?> linkRosterToSession(@PathVariable Long id, @PathVariable Long rosterId) {
        try {
            // Fetch session and roster
            Session session = sessionManager.getSession(id)
                    .orElseThrow(() -> new EntityNotFoundException("Session not found with ID: " + id));

            Roster roster = rosterManager.getRoster(rosterId)
                    .orElseThrow(() -> new EntityNotFoundException("Roster not found with ID: " + rosterId));

            // Link roster to session
            session.setRoster(roster);
            Session updatedSession = sessionManager.updateSession(session);

            // Create attendance records for all students in the roster
            List<Student> students = roster.getStudents();
            if (students != null && !students.isEmpty()) {
                List<Attendance> attendances = students.stream()
                        .map(student -> new Attendance(updatedSession, student, "PENDING", "NOT MARKED", null))
                        .toList();

                attendanceManager.saveAll(attendances);
            }

            LoggerFacade.info("Linked Roster " + rosterId + " to Session " + id + ".");
            return ResponseEntity.ok(toDTO(updatedSession));

        } catch (EntityNotFoundException e) {
            LoggerFacade.warning("Failed to link roster — " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while linking roster " + rosterId + " to session " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while linking roster to session"));
        }
    }

    // Helper: Convert Session → DTO
    private SessionDTO toDTO(Session session) {
        return new SessionDTO(
                session.getId(),
                session.getCreatedAt(),
                session.getUpdatedAt(),
                session.getCourseName(),
                session.getStartAt(),
                session.getEndAt(),
                session.isOpen(),
                session.getLateAfterMinutes(),
                session.getRoster() != null ? session.getRoster().getId() : null,
                session.getRoster() != null ? session.getRoster().getName() : null
        );
    }

    // Helper: Create error/success responses
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("error", message);
        return response;
    }

    private Map<String, String> createSuccessResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", message);
        return response;
    }
}