package com.smu.smartattendancesystem.controllers;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.NoSuchElementException;
import java.util.HashMap;
import java.util.function.*;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.smu.smartattendancesystem.services.export.CSVReportGenerator;
import com.smu.smartattendancesystem.services.export.PDFReportGenerator;
import com.smu.smartattendancesystem.services.export.ExportService;
import com.smu.smartattendancesystem.services.export.ReportGenerator;
import com.smu.smartattendancesystem.services.export.XLSXReportGenerator;
import com.smu.smartattendancesystem.utils.LoggerFacade;
import static com.smu.smartattendancesystem.utils.ResponseFormatting.createErrorResponse;

@RestController
@RequestMapping("/api/exports")
public class ExportController {

    private final ExportService exportService;

    public ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    // Export a student's attendance report based on the format (csv, xlsx, pdf), and fields requested 
    @PostMapping("/student/{studentId}")
    public ResponseEntity<?> exportStudentCustom(
            @PathVariable String studentId,
            @RequestParam(defaultValue = "csv") String format,
            @RequestBody(required = false) HashMap<String, Boolean> fields) {

        LoggerFacade.info("User requested custom student export for ID: " + studentId + " (format=" + format + ")");
        
        try {
            // Choose generator based on file extension requested
            ReportGenerator generator = pickGenerator(format);

            // Defines a function to check if a field is requested (null-safe)
            Predicate<String> v = k -> fields != null && Boolean.TRUE.equals(fields.get(k));

            // Use java Builder to construct the export options (controls which columns to include in the report)
            ExportService.Options.Builder b = ExportService.Options.builder()
                    .rosterName(v.test("rosterName"))
                    .startTime(v.test("startTime"))
                    .endTime(v.test("endTime"))
                    .lateAfter(v.test("lateAfter"))
                    .status(v.test("status"))
                    .method(v.test("method"))
                    .confidence(v.test("confidence"))
                    .timestamp(v.test("timestamp"))
                    .arrivalOffset(v.test("arrivalOffset"))
                    .open(v.test("open"));

            // Build the object
            ExportService.Options options = b.build();

            // Generate the file into memory
            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            // Generate the report using the chosen format and options
            exportService.exportStudentAttendance(studentId, options, generator, baos);

            // Generate filename with appropriate timestamp
            String ts = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = "student_" + studentId + "_" + ts + "." + generator.getFileExtension();

            InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(baos.toByteArray()));
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.parseMediaType(generator.getContentType()))
                    .contentLength(baos.size())
                    .body(resource);

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
        } catch (UnsupportedOperationException e) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Error exporting custom student report (" + studentId + "): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse("Export failed"));
        }
    }

    // Export a session summary report based on the format (csv, xlsx, pdf), and fields requested
    @PostMapping("/session/{sessionId}")
    public ResponseEntity<?> exportSessionCustom(
            @PathVariable Long sessionId,
            @RequestParam(defaultValue = "csv") String format,
            @RequestBody(required = false) HashMap<String, Boolean> fields) {

        LoggerFacade.info("User requested custom session export for ID: " + sessionId + " (format=" + format + ")");

        try {
            // Choose generator based on file extension requested
            ReportGenerator generator = pickGenerator(format);

            // Defines a function to check if a field is requested (null-safe)
            Predicate<String> v = k -> fields != null && Boolean.TRUE.equals(fields.get(k));

            // Use java Builder to construct the export options (controls which columns to include in the report)
            ExportService.Options options = ExportService.Options.builder()
                    .rosterName(v.test("rosterName"))
                    .startTime(v.test("startTime"))
                    .endTime(v.test("endTime"))
                    .lateAfter(v.test("lateAfter"))
                    .status(v.test("status"))
                    .method(v.test("method"))
                    .confidence(v.test("confidence"))
                    .timestamp(v.test("timestamp"))
                    .arrivalOffset(v.test("arrivalOffset"))
                    .open(v.test("open"))
                    .build();

            // Generate the file into memory
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            exportService.exportSessionSummary(sessionId, options, generator, baos);

            // Generate filename with appropriate timestamp
            String ts = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = "session_" + sessionId + "_" + ts + "." + generator.getFileExtension();

            InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(baos.toByteArray()));
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.parseMediaType(generator.getContentType()))
                    .contentLength(baos.size())
                    .body(resource);

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
        } catch (UnsupportedOperationException e) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Error exporting custom session report (" + sessionId + "): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse("Export failed"));
        }
    }

    // Returns the appropriate ReportGenerator based on format
    private ReportGenerator pickGenerator(String format) {
        String f = format == null ? "csv" : format.trim().toLowerCase();
        switch (f) {
            case "csv":
                return new CSVReportGenerator();
            case "xlsx":
                return new XLSXReportGenerator();
            case "pdf":
                return new PDFReportGenerator();
            default:
                throw new UnsupportedOperationException("Unsupported format: " + f);
        }
    }
}
