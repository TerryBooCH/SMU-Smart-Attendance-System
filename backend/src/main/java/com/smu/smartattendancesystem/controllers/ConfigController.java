package com.smu.smartattendancesystem.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.smu.smartattendancesystem.utils.LoggerFacade;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.smu.smartattendancesystem.utils.ResponseFormatting.createErrorResponse;
import static com.smu.smartattendancesystem.utils.ResponseFormatting.createSuccessResponse;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    private static final String PROPERTIES_FILE_PATH = "src/main/resources/application.properties";
    private static double currentRecognitionThreshold = 0.5; // default value
    
    // Initialize with current value from properties file
    static {
        loadCurrentThreshold();
    }

    // GET current recognition threshold
    @GetMapping("/recognition-threshold")
    public ResponseEntity<?> getRecognitionThreshold() {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("threshold", currentRecognitionThreshold);
            
            LoggerFacade.info("Fetched recognition threshold: " + currentRecognitionThreshold);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while fetching recognition threshold: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while fetching recognition threshold"));
        }
    }

    // UPDATE recognition threshold
    @PutMapping("/recognition-threshold")
    public ResponseEntity<?> updateRecognitionThreshold(@RequestBody Map<String, String> request) {
        try {
            String newThresholdStr = request.get("threshold");
            
            if (newThresholdStr == null || newThresholdStr.isBlank()) {
                LoggerFacade.warning("Failed to update recognition threshold: threshold value is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Threshold value is required"));
            }
            
            double newThreshold;
            try {
                newThreshold = Double.parseDouble(newThresholdStr);
            } catch (NumberFormatException e) {
                LoggerFacade.warning("Failed to update recognition threshold: threshold must be a valid number");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Threshold must be a valid number"));
            }
            
            if (newThreshold < 0 || newThreshold > 1) {
                LoggerFacade.warning("Failed to update recognition threshold: threshold must be between 0 and 1");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Threshold must be between 0 and 1"));
            }
            
            // Update properties file while preserving format and comments
            updatePropertiesFileWithFormat("faces.recognition.threshold", String.valueOf(newThreshold));
            
            // Update the in-memory value
            currentRecognitionThreshold = newThreshold;
            
            Map<String, Object> response = new HashMap<>();
            response.put("threshold", newThreshold);
            
            LoggerFacade.info("Updated recognition threshold to: " + newThreshold);
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            LoggerFacade.warning("Invalid recognition threshold update request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IOException e) {
            LoggerFacade.severe("IO error while updating recognition threshold: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to update configuration file"));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while updating recognition threshold: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while updating recognition threshold"));
        }
    }

    private void updatePropertiesFileWithFormat(String key, String value) throws IOException {
        List<String> lines = new ArrayList<>();
        boolean propertyUpdated = false;
        
        // Read all lines from the file
        try (BufferedReader reader = new BufferedReader(new FileReader(PROPERTIES_FILE_PATH))) {
            String line;
            while ((line = reader.readLine()) != null) {
                // Check if this line contains the property we want to update
                if (line.trim().startsWith(key + "=")) {
                    // Update the property value while preserving comments and spacing
                    int equalsIndex = line.indexOf('=');
                    if (equalsIndex != -1) {
                        String beforeEquals = line.substring(0, equalsIndex + 1);
                        String afterEquals = line.substring(equalsIndex + 1);
                        
                        // Check if there's a comment after the value
                        int commentIndex = afterEquals.indexOf('#');
                        String newLine;
                        if (commentIndex != -1) {
                            // Preserve the comment
                            String comment = afterEquals.substring(commentIndex);
                            newLine = beforeEquals + value + " " + comment;
                        } else {
                            // No comment, just update the value
                            newLine = beforeEquals + value;
                        }
                        lines.add(newLine);
                        propertyUpdated = true;
                    } else {
                        // Malformed line, keep as is
                        lines.add(line);
                    }
                } else {
                    // Keep the line as is
                    lines.add(line);
                }
            }
        }
        
        // If property wasn't found, add it to the Facial Detection/Recognition Config section
        if (!propertyUpdated) {
            boolean inFacialSection = false;
            boolean added = false;
            List<String> newLines = new ArrayList<>();
            
            for (String line : lines) {
                newLines.add(line);
                
                // Check if we're in the Facial Detection/Recognition Config section
                if (line.trim().equals("# Facial Detection/Recognition Config")) {
                    inFacialSection = true;
                } else if (inFacialSection && !added) {
                    // Add the property after the section header, before the next section or empty line
                    if (line.trim().isEmpty() || line.trim().startsWith("# ") && !line.trim().startsWith("# Facial")) {
                        newLines.add(key + "=" + value);
                        added = true;
                        inFacialSection = false;
                    } else if (line.trim().startsWith("faces.")) {
                        // Find the right position to insert (alphabetical order)
                        String currentKey = line.trim().split("=")[0];
                        if (key.compareTo(currentKey) < 0) {
                            int insertIndex = newLines.size() - 1;
                            newLines.add(insertIndex, key + "=" + value);
                            added = true;
                        }
                    }
                }
            }
            
            // If we didn't find a good place, add at the end of facial section or file
            if (!added) {
                // Try to find the facial section and add at the end
                boolean foundFacialSection = false;
                newLines.clear();
                for (int i = 0; i < lines.size(); i++) {
                    newLines.add(lines.get(i));
                    if (lines.get(i).trim().equals("# Facial Detection/Recognition Config")) {
                        foundFacialSection = true;
                    } else if (foundFacialSection) {
                        // Check if this is the last line of the facial section
                        if (i + 1 >= lines.size() || 
                            (!lines.get(i + 1).trim().startsWith("faces.") && 
                             !lines.get(i + 1).trim().isEmpty() && 
                             !lines.get(i + 1).trim().startsWith("# Facial"))) {
                            newLines.add(key + "=" + value);
                            added = true;
                            foundFacialSection = false;
                        }
                    }
                }
                
                // If still not added, add at the end of file
                if (!added) {
                    newLines.add("");
                    newLines.add("# Facial Detection/Recognition Config");
                    newLines.add(key + "=" + value);
                }
            }
            
            lines = newLines;
        }
        
        // Write all lines back to the file
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(PROPERTIES_FILE_PATH))) {
            for (String line : lines) {
                writer.write(line);
                writer.newLine();
            }
        }
        
        LoggerFacade.info("Successfully updated properties file with " + key + "=" + value);
    }

    private static void loadCurrentThreshold() {
        try (BufferedReader reader = new BufferedReader(new FileReader(PROPERTIES_FILE_PATH))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().startsWith("faces.recognition.threshold=")) {
                    String[] parts = line.split("=", 2);
                    if (parts.length == 2) {
                        // Remove any trailing comments and trim
                        String value = parts[1].split("#")[0].trim();
                        currentRecognitionThreshold = Double.parseDouble(value);
                        LoggerFacade.info("Loaded recognition threshold from properties: " + currentRecognitionThreshold);
                        return;
                    }
                }
            }
            LoggerFacade.warning("Recognition threshold not found in properties, using default 0.5");
            currentRecognitionThreshold = 0.5;
        } catch (Exception e) {
            LoggerFacade.warning("Could not load recognition threshold from properties, using default 0.5: " + e.getMessage());
            currentRecognitionThreshold = 0.5;
        }
    }

    // Helper method to get the current threshold (for other services to use)
    public static double getCurrentRecognitionThreshold() {
        return currentRecognitionThreshold;
    }

    // Helper method to force reload from file (if needed)
    public static void reloadThresholdFromFile() {
        LoggerFacade.info("Reloading recognition threshold from properties file");
        loadCurrentThreshold();
    }
}