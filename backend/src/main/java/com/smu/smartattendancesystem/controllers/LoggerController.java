package com.smu.smartattendancesystem.controllers;

import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.smu.smartattendancesystem.utils.LoggerFacade;

@RestController
@RequestMapping("/api/logs")
public class LoggerController {

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadLogFile() {
        LoggerFacade.info("User attempting to download log file");
        
        try {
            File logFile = new File("attendance.log");
            
            if (!logFile.exists()) {
                LoggerFacade.warning("Log file download failed - file not found");
                return ResponseEntity.notFound().build();
            }

            InputStreamResource resource = new InputStreamResource(new FileInputStream(logFile));
            
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = "attendance_log_" + timestamp + ".txt";
            
            LoggerFacade.info("Log file download successful - file: " + filename + ", size: " + logFile.length() + " bytes");
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.TEXT_PLAIN)
                    .contentLength(logFile.length())
                    .body(resource);
                    
        } catch (FileNotFoundException e) {
            LoggerFacade.severe("Log file download error - file not found: " + e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error during log file download: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}