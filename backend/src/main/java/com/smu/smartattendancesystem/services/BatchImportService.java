package com.smu.smartattendancesystem.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.smu.smartattendancesystem.dto.FaceDataDTO;
import com.smu.smartattendancesystem.dto.RosterSummaryDTO;
import com.smu.smartattendancesystem.dto.StudentWithFaceDTO;
import com.smu.smartattendancesystem.models.Roster;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.repositories.StudentRepository;

@Service
public class BatchImportService {

    // Validation patterns
    private static final Pattern STUDENT_ID_PATTERN = Pattern.compile("^[A-Z]\\d{7}$");
    private static final Pattern CLASS_NAME_PATTERN = Pattern.compile("^[A-Za-z]{2}\\d{3}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\d{8}$");

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RosterService rosterService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private FaceDataService faceDataService;

    // Validates student fields according to the defined patterns
    private List<String> validateStudentFields(String studentId, String name, String email, 
                                                 String phone, String className) {
        List<String> validationErrors = new ArrayList<>();

        // Validate Student ID
        if (studentId == null || studentId.isEmpty()) {
            validationErrors.add("Student ID is required");
        } else if (!STUDENT_ID_PATTERN.matcher(studentId).matches()) {
            validationErrors.add("Student ID must start with a capital letter followed by 7 numbers (e.g., S1234567)");
        }

        // Validate Name
        if (name == null || name.isEmpty()) {
            validationErrors.add("Name is required");
        } else if (name.length() < 2) {
            validationErrors.add("Name must be at least 2 characters");
        }

        // Validate Email
        if (email == null || email.isEmpty()) {
            validationErrors.add("Email is required");
        } else if (!EMAIL_PATTERN.matcher(email).matches()) {
            validationErrors.add("Enter a valid email address");
        }

        // Validate Phone (optional, but must be 8 digits if provided)
        if (phone != null && !phone.isEmpty()) {
            if (!phone.matches("^\\d+$")) {
                validationErrors.add("Phone number must contain only numbers");
            } else if (!PHONE_PATTERN.matcher(phone).matches()) {
                validationErrors.add("Phone number must be exactly 8 digits");
            }
        }

        // Validate Class Name
        if (className == null || className.isEmpty()) {
            validationErrors.add("Class is required");
        } else if (!CLASS_NAME_PATTERN.matcher(className).matches()) {
            validationErrors.add("Class must start with 2 letters followed by 3 numbers (e.g., AB123)");
        }

        return validationErrors;
    }

    public Map<String, Object> importStudentsFromCsv(MultipartFile file) {
        List<StudentWithFaceDTO> importedStudents = new ArrayList<>();
        List<Map<String, Object>> errors = new ArrayList<>();
        int lineNumber = 0;

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream()))) {

            String line;
            reader.readLine(); // Skip header
            lineNumber++;

            while ((line = reader.readLine()) != null) {
                lineNumber++;

                if (line.trim().isEmpty()) continue; // Skip empty lines

                String[] parts = line.split(",");
                if (parts.length < 5) {
                    Map<String, Object> error = new LinkedHashMap<>();
                    error.put("line", lineNumber);
                    error.put("data", line);
                    error.put("reason", "Invalid format: Expected 5 columns (studentId, name, email, phone, className)");
                    errors.add(error);
                    continue;
                }

                String studentId = parts[0].trim();
                String name = parts[1].trim();
                String email = parts[2].trim();
                String phone = parts[3].trim();
                String className = parts[4].trim();

                // Validate fields
                List<String> validationErrors = validateStudentFields(studentId, name, email, phone, className);
                if (!validationErrors.isEmpty()) {
                    Map<String, Object> error = new LinkedHashMap<>();
                    error.put("line", lineNumber);
                    error.put("data", line);
                    error.put("reason", "Validation failed: " + String.join(", ", validationErrors));
                    errors.add(error);
                    continue;
                }

                // Check for duplicates
                if (studentRepository.findByStudentId(studentId).isPresent()) {
                    Map<String, Object> error = new LinkedHashMap<>();
                    error.put("line", lineNumber);
                    error.put("data", line);
                    error.put("reason", "Duplicate student ID: " + studentId);
                    errors.add(error);
                    continue;
                }

                if (studentRepository.findByEmail(email).isPresent()) {
                    Map<String, Object> error = new LinkedHashMap<>();
                    error.put("line", lineNumber);
                    error.put("data", line);
                    error.put("reason", "Duplicate email: " + email);
                    errors.add(error);
                    continue;
                }
                
                try {
                    Student student = new Student(studentId, name, email, phone, className);
                    Student savedStudent = studentService.createStudent(student);

                    // Get face data if available
                    FaceDataDTO face = faceDataService.getLatestFaceData(savedStudent.getStudentId())
                            .orElse(null);
                    StudentWithFaceDTO dto = StudentWithFaceDTO.from(savedStudent, face);
                    importedStudents.add(dto);

                } catch (IllegalArgumentException | IllegalStateException e) {
                    Map<String, Object> error = new LinkedHashMap<>();
                    error.put("line", lineNumber);
                    error.put("data", line);
                    error.put("reason", "Invalid student data: " + e.getMessage());
                    errors.add(error);
                } catch (RuntimeException e) {
                    Map<String, Object> error = new LinkedHashMap<>();
                    error.put("line", lineNumber);
                    error.put("data", line);
                    error.put("reason", "Error creating student: " + e.getMessage());
                    errors.add(error);
                }
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to read CSV file", e);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("importedCount", importedStudents.size());
        response.put("errorCount", errors.size());
        response.put("students", importedStudents);
        if (!errors.isEmpty()) {
            response.put("errors", errors);
        }
        return response;
    }

    public Map<String, Object> importRostersFromCsv(MultipartFile file) {
        Set<Long> affectedRosterIds = new HashSet<>();
        Set<String> processedStudentIds = new HashSet<>();
        List<Map<String, Object>> errors = new ArrayList<>();
        int successCount = 0;
        int lineNumber = 0;

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String header = reader.readLine(); // consume header
            lineNumber++;
            
            if (header == null) {
                throw new RuntimeException("CSV file is empty");
            }

            String line;
            while ((line = reader.readLine()) != null) {
                lineNumber++;

                if (line.trim().isEmpty()) continue;

                String[] parts = line.split(",");
                if (parts.length != 2) {
                    Map<String, Object> error = new LinkedHashMap<>();
                    error.put("line", lineNumber);
                    error.put("data", line);
                    error.put("reason", "Invalid format: Expected exactly 2 columns (rosterId, studentId)");
                    errors.add(error);
                    continue;
                }

                String rosterIdRaw = parts[0].trim();
                String studentId = parts[1].trim();

                if (rosterIdRaw.isEmpty() || studentId.isEmpty()) {
                    Map<String, Object> error = new LinkedHashMap<>();
                    error.put("line", lineNumber);
                    error.put("data", line);
                    error.put("reason", "Empty rosterId or studentId");
                    errors.add(error);
                    continue;
                }

                // Validate Student ID format
                if (!STUDENT_ID_PATTERN.matcher(studentId).matches()) {
                    Map<String, Object> error = new LinkedHashMap<>();
                    error.put("line", lineNumber);
                    error.put("data", line);
                    error.put("reason", "Invalid student ID format: " + studentId + 
                             " (must start with a capital letter followed by 7 numbers, e.g., S1234567)");
                    errors.add(error);
                    continue;
                }

                final Long rosterId;
                try {
                    rosterId = Long.valueOf(rosterIdRaw);
                } catch (NumberFormatException nfe) {
                    Map<String, Object> error = new LinkedHashMap<>();
                    error.put("line", lineNumber);
                    error.put("data", line);
                    error.put("reason", "Invalid roster ID (not a number): " + rosterIdRaw);
                    errors.add(error);
                    continue;
                }

                // Check if student already processed in this import
                if (processedStudentIds.contains(studentId)) {
                    Map<String, Object> error = new LinkedHashMap<>();
                    error.put("line", lineNumber);
                    error.put("data", line);
                    error.put("reason", "Duplicate student in import: " + studentId + " (student already added to another roster in this import)");
                    errors.add(error);
                    continue;
                }

                // Verify roster exists
                try {
                    rosterService.getRosterById(rosterId);
                } catch (Exception e) {
                    Map<String, Object> error = new LinkedHashMap<>();
                    error.put("line", lineNumber);
                    error.put("data", line);
                    error.put("reason", "Roster not found: " + rosterId);
                    errors.add(error);
                    continue;
                }

                // Verify student exists
                Optional<Student> studentOpt = studentRepository.findByStudentId(studentId);
                if (studentOpt.isEmpty()) {
                    Map<String, Object> error = new LinkedHashMap<>();
                    error.put("line", lineNumber);
                    error.put("data", line);
                    error.put("reason", "Student not found: " + studentId);
                    errors.add(error);
                    continue;
                }

                // Try to add student to roster
                try {
                    rosterService.addStudentToRoster(rosterId, studentId);
                    affectedRosterIds.add(rosterId);
                    processedStudentIds.add(studentId);
                    successCount++;
                } catch (Exception e) {
                    Map<String, Object> error = new LinkedHashMap<>();
                    error.put("line", lineNumber);
                    error.put("data", line);
                    error.put("reason", e.getMessage());
                    errors.add(error);
                }
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to read CSV file", e);
        }

        // Get updated roster summaries for all affected rosters
        List<RosterSummaryDTO> rosterSummaries = new ArrayList<>();
        for (Long rosterId : affectedRosterIds) {
            try {
                Roster roster = rosterService.getRosterById(rosterId);
                RosterSummaryDTO summary = new RosterSummaryDTO(
                    roster.getId(),
                    roster.getName(),
                    roster.getCreatedAt(),
                    roster.getUpdatedAt(),
                    (roster.getStudentRosters() != null) ? roster.getStudentRosters().size() : 0
                );
                rosterSummaries.add(summary);
            } catch (Exception e) {
                // Skip if roster can't be retrieved
            }
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("importedCount", successCount);
        response.put("errorCount", errors.size());
        response.put("rosters", rosterSummaries);
        if (!errors.isEmpty()) {
            response.put("errors", errors);
        }
        return response;
    }
}