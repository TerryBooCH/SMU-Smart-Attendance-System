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
import java.util.Set;

import static com.smu.smartattendancesystem.utils.ResponseFormatting.createErrorResponse;
import static com.smu.smartattendancesystem.utils.ResponseFormatting.createSuccessResponse;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    private static final String PROPERTIES_FILE_PATH = "src/main/resources/application.properties";
    private static final Set<String> VALID_DETECTORS = Set.of("haar", "lbp", "yolo");
    private static final Set<String> VALID_RECOGNIZERS = Set.of("eigen", "hist", "neuralnet");
    private static final Set<String> HIST_ONLY_DETECTORS = Set.of("haar", "lbp");
    
    private static double currentRecognitionThreshold = 0.5; // default value
    private static String currentDefaultDetector = "yolo"; // default value
    private static String currentDefaultRecognizer = "eigen"; // default value
    
    // Initialize with current values from properties file
    static {
        loadCurrentConfigs();
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
            
            // Updated range validation from -1.0 to 1.0
            if (newThreshold < -1.0 || newThreshold > 1.0) {
                LoggerFacade.warning("Failed to update recognition threshold: threshold must be between -1.0 and 1.0");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Threshold must be between -1.0 and 1.0"));
            }
            
            // Update properties file while preserving format and comments
            updatePropertiesFileWithFormat("faces.recognition.autoThreshold", String.valueOf(newThreshold));
            
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

    // GET current default detector
    @GetMapping("/default-detector")
    public ResponseEntity<?> getDefaultDetector() {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("defaultDetector", currentDefaultDetector);
            
            LoggerFacade.info("Fetched default detector: " + currentDefaultDetector);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while fetching default detector: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while fetching default detector"));
        }
    }

    // UPDATE default detector with automatic recognizer adjustment
    @PutMapping("/default-detector")
    public ResponseEntity<?> updateDefaultDetector(@RequestBody Map<String, String> request) {
        try {
            String newDetector = request.get("defaultDetector");
            
            if (newDetector == null || newDetector.isBlank()) {
                LoggerFacade.warning("Failed to update default detector: detector value is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Detector value is required"));
            }
            
            newDetector = newDetector.toLowerCase();
            if (!VALID_DETECTORS.contains(newDetector)) {
                LoggerFacade.warning("Failed to update default detector: invalid detector type. Allowed values: " + VALID_DETECTORS);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Invalid detector type. Allowed values: " + VALID_DETECTORS));
            }
            
            // Check if we need to auto-adjust the recognizer
            boolean recognizerAdjusted = false;
            
            if (HIST_ONLY_DETECTORS.contains(newDetector) && !"hist".equals(currentDefaultRecognizer)) {
                // Auto-adjust to hist for haar/lbp detectors
                currentDefaultRecognizer = "hist";
                recognizerAdjusted = true;
                
                // Update recognizer in properties file
                updatePropertiesFileWithFormat("faces.recognition.defaultRecognizer", currentDefaultRecognizer);
                
                LoggerFacade.info("Auto-adjusted default recognizer to 'hist' for detector: " + newDetector);
            }
            
            // Update detector in properties file
            updatePropertiesFileWithFormat("faces.detection.defaultDetector", newDetector);
            currentDefaultDetector = newDetector;
            
            Map<String, Object> response = new HashMap<>();
            response.put("defaultDetector", newDetector);
            response.put("defaultRecognizer", currentDefaultRecognizer);
            
            LoggerFacade.info("Updated default detector to: " + newDetector);
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            LoggerFacade.warning("Invalid default detector update request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IOException e) {
            LoggerFacade.severe("IO error while updating default detector: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to update configuration file"));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while updating default detector: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while updating default detector"));
        }
    }

    // GET current default recognizer
    @GetMapping("/default-recognizer")
    public ResponseEntity<?> getDefaultRecognizer() {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("defaultRecognizer", currentDefaultRecognizer);
            
            LoggerFacade.info("Fetched default recognizer: " + currentDefaultRecognizer);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while fetching default recognizer: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while fetching default recognizer"));
        }
    }

    // UPDATE default recognizer with compatibility validation
    @PutMapping("/default-recognizer")
    public ResponseEntity<?> updateDefaultRecognizer(@RequestBody Map<String, String> request) {
        try {
            String newRecognizer = request.get("defaultRecognizer");
            
            if (newRecognizer == null || newRecognizer.isBlank()) {
                LoggerFacade.warning("Failed to update default recognizer: recognizer value is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Recognizer value is required"));
            }
            
            newRecognizer = newRecognizer.toLowerCase();
            if (!VALID_RECOGNIZERS.contains(newRecognizer)) {
                LoggerFacade.warning("Failed to update default recognizer: invalid recognizer type. Allowed values: " + VALID_RECOGNIZERS);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Invalid recognizer type. Allowed values: " + VALID_RECOGNIZERS));
            }
            
            // Validate detector-recognizer compatibility
            if (HIST_ONLY_DETECTORS.contains(currentDefaultDetector) && !"hist".equals(newRecognizer)) {
                String errorMessage = String.format(
                    "Detector '%s' can only use 'hist' recognizer. Please change detector to 'yolo' first to use other recognizers.",
                    currentDefaultDetector
                );
                LoggerFacade.warning("Failed to update default recognizer: " + errorMessage);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse(errorMessage));
            }
            
            // Update properties file while preserving format and comments
            updatePropertiesFileWithFormat("faces.recognition.defaultRecognizer", newRecognizer);
            
            // Update the in-memory value
            currentDefaultRecognizer = newRecognizer;
            
            Map<String, Object> response = new HashMap<>();
            response.put("defaultDetector", currentDefaultDetector);
            response.put("defaultRecognizer", newRecognizer);
            
            LoggerFacade.info("Updated default recognizer to: " + newRecognizer);
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            LoggerFacade.warning("Invalid default recognizer update request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IOException e) {
            LoggerFacade.severe("IO error while updating default recognizer: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to update configuration file"));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while updating default recognizer: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while updating default recognizer"));
        }
    }

    // The rest of the methods remain the same...
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
                    if (line.trim().isEmpty() || (line.trim().startsWith("# ") && !line.trim().startsWith("# Facial"))) {
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

    private static void loadCurrentConfigs() {
        try (BufferedReader reader = new BufferedReader(new FileReader(PROPERTIES_FILE_PATH))) {
            String line;
            while ((line = reader.readLine()) != null) {
                // Load recognition threshold
                if (line.trim().startsWith("faces.recognition.autoThreshold=")) {
                    String[] parts = line.split("=", 2);
                    if (parts.length == 2) {
                        String value = parts[1].split("#")[0].trim();
                        currentRecognitionThreshold = Double.parseDouble(value);
                    }
                }
                // Load default detector
                else if (line.trim().startsWith("faces.detection.defaultDetector=")) {
                    String[] parts = line.split("=", 2);
                    if (parts.length == 2) {
                        currentDefaultDetector = parts[1].split("#")[0].trim();
                    }
                }
                // Load default recognizer
                else if (line.trim().startsWith("faces.recognition.defaultRecognizer=")) {
                    String[] parts = line.split("=", 2);
                    if (parts.length == 2) {
                        currentDefaultRecognizer = parts[1].split("#")[0].trim();
                    }
                }
            }
            
            // Validate loaded configuration for compatibility
            if (HIST_ONLY_DETECTORS.contains(currentDefaultDetector) && !"hist".equals(currentDefaultRecognizer)) {
                LoggerFacade.warning("Invalid configuration: Detector " + currentDefaultDetector + " can only use 'hist' recognizer. Auto-adjusting to hist.");
                currentDefaultRecognizer = "hist";
                // Optionally update the properties file here as well
            }
            
            LoggerFacade.info("Loaded configuration from properties - Detector: " + currentDefaultDetector + 
                            ", Recognizer: " + currentDefaultRecognizer + 
                            ", Threshold: " + currentRecognitionThreshold);
        } catch (Exception e) {
            LoggerFacade.warning("Could not load configuration from properties, using defaults: " + e.getMessage());
            currentRecognitionThreshold = 0.5;
            currentDefaultDetector = "yolo";
            currentDefaultRecognizer = "eigen";
        }
    }

    // Helper methods for other services to use
    public static double getCurrentRecognitionThreshold() {
        return currentRecognitionThreshold;
    }
    
    public static String getCurrentDefaultDetector() {
        return currentDefaultDetector;
    }
    
    public static String getCurrentDefaultRecognizer() {
        return currentDefaultRecognizer;
    }

    // Helper method to check if current detector-recognizer combination is valid
    public static boolean isConfigurationValid() {
        if (HIST_ONLY_DETECTORS.contains(currentDefaultDetector)) {
            return "hist".equals(currentDefaultRecognizer);
        }
        return true;
    }

    // Helper method to force reload from file (if needed)
    public static void reloadConfigsFromFile() {
        LoggerFacade.info("Reloading configuration from properties file");
        loadCurrentConfigs();
    }
}