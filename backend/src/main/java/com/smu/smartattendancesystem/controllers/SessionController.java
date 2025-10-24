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
                }
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(savedSession));

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse("Database constraint violated"));
        } catch (Exception e) {
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

            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
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

            return ResponseEntity.ok(toDTO(session));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
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

            if (session.isOpen()) {
                throw new IllegalStateException("Session is already open");
            }

            session.setOpen(true);
            Session updated = sessionManager.updateSession(session);
            return ResponseEntity.ok(toDTO(updated));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
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

            if (!session.isOpen()) {
                throw new IllegalStateException("Session is already closed");
            }

            session.setOpen(false);
            Session updated = sessionManager.updateSession(session);
            return ResponseEntity.ok(toDTO(updated));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
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
            return ResponseEntity.ok(createSuccessResponse("Session deleted successfully"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
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

            return ResponseEntity.ok(toDTO(updatedSession));

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
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
