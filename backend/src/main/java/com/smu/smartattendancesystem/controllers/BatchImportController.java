package com.smu.smartattendancesystem.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.smu.smartattendancesystem.services.BatchImportService;
import com.smu.smartattendancesystem.utils.LoggerFacade;

@RestController
@RequestMapping("/api/import")
public class BatchImportController {

    @Autowired
    private BatchImportService batchImportService;

    @PostMapping("/students")
    public ResponseEntity<?> importStudents(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> result = batchImportService.importStudentsFromCsv(file);

            // Extract import statistics for logging
            String status = (String) result.get("status");
            int imported = (int) result.getOrDefault("imported", 0);
            int failed = (int) result.getOrDefault("failed", 0);
            int total = (int) result.getOrDefault("total", 0);

            if ("success".equals(status)) {
                LoggerFacade.info("Successfully imported students from file: " + file.getOriginalFilename() +
                        " - Imported: " + imported + "/" + total + ", Failed: " + failed);
            } else {
                LoggerFacade.warning("Partial student import from file: " + file.getOriginalFilename() +
                        " - Imported: " + imported + "/" + total + ", Failed: " + failed);
            }

            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            LoggerFacade.warning("Invalid student import request for file: " + file.getOriginalFilename() +
                    " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "status", "error",
                            "message", e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error during student import from file: " + file.getOriginalFilename() +
                    " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to import students: " + e.getMessage()));
        }
    }

    @PostMapping("/rosters")
    public ResponseEntity<?> importRosters(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> result = batchImportService.importRostersFromCsv(file);

            // Extract import statistics for logging
            String status = (String) result.get("status");
            int imported = (int) result.getOrDefault("imported", 0);
            int failed = (int) result.getOrDefault("failed", 0);
            int total = (int) result.getOrDefault("total", 0);

            if ("success".equals(status)) {
                LoggerFacade.info("Successfully imported rosters from file: " + file.getOriginalFilename() +
                        " - Imported: " + imported + "/" + total + ", Failed: " + failed);
            } else {
                LoggerFacade.warning("Partial roster import from file: " + file.getOriginalFilename() +
                        " - Imported: " + imported + "/" + total + ", Failed: " + failed);
            }

            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            LoggerFacade.warning("Invalid roster import request for file: " + file.getOriginalFilename() +
                    " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "status", "error",
                            "message", e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error during roster import from file: " + file.getOriginalFilename() +
                    " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to import rosters: " + e.getMessage()));
        }
    }
}