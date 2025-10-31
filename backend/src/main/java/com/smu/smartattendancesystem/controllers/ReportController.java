package com.smu.smartattendancesystem.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smu.smartattendancesystem.dto.SessionSummaryDTO;
import com.smu.smartattendancesystem.services.ReportService;
import com.smu.smartattendancesystem.utils.LoggerFacade;
import static com.smu.smartattendancesystem.utils.ResponseFormatting.createErrorResponse;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // Retrieve session summary
    @GetMapping("/session/{sessionId}/summary")
    public ResponseEntity<?> getSessionSummary(@PathVariable Long sessionId) {
        try {
            LoggerFacade.info("Generating session summary for session ID: " + sessionId);
            SessionSummaryDTO summary = reportService.getSessionSummary(sessionId);
            return ResponseEntity.ok(summary);
        } catch (EntityNotFoundException e) {
            LoggerFacade.warning("Session not found: " + sessionId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));

        } catch (IllegalArgumentException e) {
            LoggerFacade.warning("Invalid session ID: " + sessionId + " | " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));

        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while generating session summary (Session ID: " + sessionId + "): "
                    + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while generating the session summary"));
        }
    }

}
