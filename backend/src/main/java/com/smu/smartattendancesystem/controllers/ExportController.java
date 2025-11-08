package com.smu.smartattendancesystem.controllers;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.NoSuchElementException;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smu.smartattendancesystem.services.export.CSVReportGenerator;
import com.smu.smartattendancesystem.services.export.ExportService;
import com.smu.smartattendancesystem.services.export.ReportGenerator;
import com.smu.smartattendancesystem.utils.LoggerFacade;
import static com.smu.smartattendancesystem.utils.ResponseFormatting.createErrorResponse;

@RestController
@RequestMapping("/api/exports")
public class ExportController {

    private final ExportService exportService;

    public ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    // Export a student's attendance report based on the format (csv, xlsx, pdf)
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> exportStudent(
            @PathVariable String studentId,
            @RequestParam(defaultValue = "csv") String format) {
        LoggerFacade.info("User requested student export for ID: " + studentId + " (format=" + format + ")");
        try {
            // Choose generator based on format
            ReportGenerator generator = pickGenerator(format);

            // Generate report in memory
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            exportService.exportStudentAttendance(studentId, generator, baos);

            // Prepare filename with timestamp
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = "student_" + studentId + "_" + timestamp + "." + generator.getFileExtension();

            // Wrap the bytes as a downloadable resource
            InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(baos.toByteArray()));

            LoggerFacade.info("Generated export file: " + filename + " | size: " + baos.size() + " bytes");

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.parseMediaType(generator.getContentType()))
                    .contentLength(baos.size())
                    .body(resource);

        } catch (NoSuchElementException e) {
            LoggerFacade.warning("Student not found: " + studentId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (UnsupportedOperationException e) {
            LoggerFacade.warning("Export format not implemented: " + format);
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Error exporting student report (" + studentId + "): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Export failed"));
        }
    }

    // Export a session summary report (csv, xlsx, pdf)
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<?> exportSession(
            @PathVariable Long sessionId,
            @RequestParam(defaultValue = "csv") String format) {

        LoggerFacade.info("User requested session export for ID: " + sessionId + " (format=" + format + ")");
        try {
            ReportGenerator generator = pickGenerator(format);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            exportService.exportSessionSummary(sessionId, generator, baos);

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = "session_" + sessionId + "_" + timestamp + "." + generator.getFileExtension();

            InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(baos.toByteArray()));
            LoggerFacade.info("Generated export file: " + filename + " | size: " + baos.size() + " bytes");

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.parseMediaType(generator.getContentType()))
                    .contentLength(baos.size())
                    .body(resource);

        } catch (NoSuchElementException e) {
            LoggerFacade.warning("Session not found: " + sessionId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (UnsupportedOperationException e) {
            LoggerFacade.warning("Export format not implemented: " + format);
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Error exporting session report (" + sessionId + "): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Export failed"));
        }
    }

    // Returns the appropriate ReportGenerator based on format
    private ReportGenerator pickGenerator(String format) {
        String f = format == null ? "csv" : format.trim().toLowerCase();
        switch (f) {
            case "csv":
                return new CSVReportGenerator();
            case "xlsx":
                throw new UnsupportedOperationException("XLSX export not implemented yet");
            case "pdf":
                throw new UnsupportedOperationException("PDF export not implemented yet");
            default:
                throw new UnsupportedOperationException("Unsupported format: " + f);
        }
    }
}
