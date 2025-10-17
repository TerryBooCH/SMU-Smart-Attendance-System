package com.smu.smartattendancesystem.controllers;

import org.springframework.beans.factory.annotation.Autowired;
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
    private BatchImportService studentImportService;

    @PostMapping("/students")
    public ResponseEntity<?> importStudents(@RequestParam("file") MultipartFile file) {
        studentImportService.importStudentsFromCsv(file);
        return ResponseEntity.ok("Students imported successfully.");
    }
}
