package com.smu.smartattendancesystem.controllers;


import java.io.IOException;
import java.util.*;

import com.smu.smartattendancesystem.biometrics.detection.DetectionResult;

import com.smu.smartattendancesystem.services.BiometricService;
import com.smu.smartattendancesystem.utils.LoggerFacade;
import com.smu.smartattendancesystem.dto.*;
import static com.smu.smartattendancesystem.utils.ResponseFormatting.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/biometric")
public class BiometricController {
    private final BiometricService biometricService;

    public BiometricController(BiometricService biometricService) {
        this.biometricService = biometricService;
    }
    
    @PostMapping("/detect")
    public ResponseEntity<?> detect(@RequestParam("image") MultipartFile image, @RequestParam("type") String type) {
        try {
            List<DetectionResultDTO> results = this.biometricService.detect(image, type);
            LoggerFacade.info("Biometric detection successful - Type: " + type + 
                            ", File: " + image.getOriginalFilename() + 
                            ", Results: " + results.size());
            return ResponseEntity.ok(results);
        } catch (IllegalArgumentException e) {
            LoggerFacade.warning("Invalid biometric detection request - Type: " + type + 
                            ", File: " + image.getOriginalFilename() + 
                            " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error during biometric detection - Type: " + type + 
                            ", File: " + image.getOriginalFilename() + 
                            " - " + e.getMessage());
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while detecting."));
        }
    }
}
