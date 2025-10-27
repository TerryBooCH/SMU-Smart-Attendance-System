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

    // UPDATE attendance status by session and student internal IDs
    @PutMapping("/session/{sessionId}/student/{studentId}")
    public ResponseEntity<?> updateAttendanceStatus(
            @PathVariable Long sessionId,
            @PathVariable Long studentId,
            @RequestBody Map<String, String> request) {
        try {
            String newStatus = request.get("status");
            String method = request.get("method");
            
            if (newStatus == null || newStatus.isBlank()) {
                throw new IllegalArgumentException("Status is required");
            }

            // Validate status
            if (!isValidStatus(newStatus)) {
                throw new IllegalArgumentException("Invalid status. Must be one of: PENDING, ABSENT, PRESENT, LATE");
            }

            if (method == null || method.isBlank()) {
                method = "MANUAL";
            }

            // Validate method
            if (!isValidMethod(method)) {
                throw new IllegalArgumentException("Invalid method. Must be one of: AUTO, MANUAL, NOT MARKED");
            }

            Attendance updatedAttendance = attendanceManager.updateAttendanceStatusBySessionAndStudent(sessionId, studentId, newStatus, method);
            LoggerFacade.info("Updated attendance for Session ID: " + sessionId + ", Student Internal ID: " + studentId + " to status: " + newStatus);
            return ResponseEntity.ok(convertToDTO(updatedAttendance));
        } catch (NoSuchElementException e) {
            LoggerFacade.warning("Failed to update — Attendance record not found for Session ID: " + sessionId + ", Student Internal ID: " + studentId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Attendance record not found for Session ID: " + sessionId + " and Student Internal ID: " + studentId));
        } catch (IllegalArgumentException e) {
            LoggerFacade.warning("Invalid attendance update request for Session ID: " + sessionId + ", Student Internal ID: " + studentId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while updating attendance for Session ID: " + sessionId + ", Student Internal ID: " + studentId + ": " + e.getMessage());
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
    private boolean isValidStatus(String status) {
        return status != null && 
            (status.equals("PENDING") || status.equals("PRESENT") || 
                status.equals("ABSENT") || status.equals("LATE"));
    }

    private boolean isValidMethod(String method) {
        return method != null && 
            (method.equals("AUTO") || method.equals("MANUAL") || 
                method.equals("NOT MARKED"));
    }

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