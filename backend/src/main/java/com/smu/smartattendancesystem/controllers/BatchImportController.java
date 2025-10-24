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

@RestController
@RequestMapping("/api/import")
public class BatchImportController {

    @Autowired
    private BatchImportService batchImportService;

    @PostMapping("/students")
    public ResponseEntity<?> importStudents(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> result = batchImportService.importStudentsFromCsv(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to import students: " + e.getMessage()
                    ));
        }
    }

    @PostMapping("/rosters")
    public ResponseEntity<?> importRosters(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> result = batchImportService.importRostersFromCsv(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to import rosters: " + e.getMessage()
                    ));
        }
    }
}