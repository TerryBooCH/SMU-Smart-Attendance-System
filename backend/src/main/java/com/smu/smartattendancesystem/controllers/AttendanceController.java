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

import com.smu.smartattendancesystem.dto.AttendanceDTO;
import com.smu.smartattendancesystem.managers.AttendanceManager;
import com.smu.smartattendancesystem.models.Attendance;
import com.smu.smartattendancesystem.utils.LoggerFacade;

@RestController
@RequestMapping("/api/attendances")
public class AttendanceController {

    private final AttendanceManager attendanceManager;

    public AttendanceController(AttendanceManager attendanceManager) {
        this.attendanceManager = attendanceManager;
    }

    // GET attendance records by session ID
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<?> getAttendanceBySessionId(@PathVariable Long sessionId) {
        try {
            List<Attendance> attendances = attendanceManager.getAttendanceBySessionId(sessionId);
            
            // Convert to DTO to avoid circular references and include only needed data
            List<AttendanceDTO> attendanceDTOs = attendances.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            
            // Create response with records and count
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("records", attendanceDTOs);
            response.put("totalCount", attendanceDTOs.size());
            
            LoggerFacade.info("Fetched " + attendanceDTOs.size() + " attendance records for Session ID: " + sessionId);
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            LoggerFacade.warning("Session not found while fetching attendance: ID " + sessionId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Session not found with ID: " + sessionId));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while fetching attendance for session " + sessionId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while retrieving attendance records"));
        }
    }

    // UPDATE attendance status
    @PutMapping("/{attendanceId}")
    public ResponseEntity<?> updateAttendanceStatus(
            @PathVariable Long attendanceId,
            @RequestBody Map<String, String> request) {
        try {
            String newStatus = request.get("status");
            String method = request.get("method");
            
            if (newStatus == null || newStatus.isBlank()) {
                throw new IllegalArgumentException("Status is required");
            }

            if (method == null || method.isBlank()) {
                method = "MANUAL";
            }

            Attendance updatedAttendance = attendanceManager.updateAttendanceStatus(attendanceId, newStatus, method);
            LoggerFacade.info("Updated attendance record ID: " + attendanceId + " to status: " + newStatus);
            return ResponseEntity.ok(convertToDTO(updatedAttendance));
        } catch (NoSuchElementException e) {
            LoggerFacade.warning("Failed to update — Attendance record not found: ID " + attendanceId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Attendance record not found with ID: " + attendanceId));
        } catch (IllegalArgumentException e) {
            LoggerFacade.warning("Invalid attendance update request for ID " + attendanceId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            LoggerFacade.warning("Conflict while updating attendance record " + attendanceId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while updating attendance record " + attendanceId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while updating attendance record"));
        }
    }

    // Convert Attendance entity to DTO
    private AttendanceDTO convertToDTO(Attendance attendance) {
        return new AttendanceDTO(
                attendance.getId(),
                attendance.getCreatedAt(),
                attendance.getUpdatedAt(),
                attendance.getStatus(),
                attendance.getMethod(),
                attendance.getConfidence(),
                attendance.getTimestamp(),
                attendance.getStudent().getId(),
                attendance.getStudent().getStudentId(),
                attendance.getStudent().getName(),
                attendance.getStudent().getEmail(),
                attendance.getStudent().getPhone(),
                attendance.getStudent().getClassName(),
                attendance.getSession().getId(),
                attendance.getSession().getCourseName(),
                attendance.getSession().isOpen()
        );
    }

    // Helper methods
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", message);
        response.put("status", "error");
        return response;
    }

    @SuppressWarnings("unused")
    private Map<String, String> createSuccessResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        response.put("status", "success");
        return response;
    }
}