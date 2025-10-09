package com.smu.smartattendancesystem.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.smu.smartattendancesystem.models.FaceData;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.services.FaceDataService;
import com.smu.smartattendancesystem.services.StudentService;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final StudentService studentService;
    private final FaceDataService faceDataService;

    public StudentController(StudentService studentService, FaceDataService faceDataService) {
        this.studentService = studentService;
        this.faceDataService = faceDataService;
    }

    // CREATE
    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentService.createStudent(student);
    }

    // READ all
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    // READ one by studentId
    @GetMapping("/{studentId}")
    public Optional<Student> getStudent(@PathVariable String studentId) {
        System.out.println("=== GET Student Called with ID: " + studentId + " ===");
        return studentService.getStudentByStudentId(studentId);
    }

    // UPDATE by studentId
    @PutMapping("/{studentId}")
    public Student updateStudent(@PathVariable String studentId, @RequestBody Student student) {
        System.out.println("=== UPDATE Student Called with ID: " + studentId + " ===");
        Optional<Student> existingStudentOpt = studentService.getStudentByStudentId(studentId);

        if (existingStudentOpt.isEmpty()) {
            throw new RuntimeException("Student not found with ID: " + studentId);
        }

        Student existingStudent = existingStudentOpt.get();
        existingStudent.setName(student.getName());
        existingStudent.setEmail(student.getEmail());
        existingStudent.setPhone(student.getPhone());

        return studentService.updateStudent(studentId, existingStudent);
    }

    // DELETE by studentId
    @DeleteMapping("/{studentId}")
    public String deleteStudent(@PathVariable String studentId) {
        System.out.println("=== DELETE Student Called with ID: " + studentId + " ===");
        Optional<Student> student = studentService.getStudentByStudentId(studentId);

        if (student.isEmpty()) {
            throw new RuntimeException("Student not found with ID: " + studentId);
        }

        studentService.deleteStudent(student.get().getStudentId());
        return "Student deleted successfully";
    }

    // READ face data for a student
    @GetMapping("/{studentId}/faces")
    public ResponseEntity<?> listFaces(@PathVariable String studentId) {
        try {
            return ResponseEntity.ok(faceDataService.list(studentId));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while listing face data"));
        }
    }

    // CREATE face data for a student
    @PostMapping(value = "/{studentId}/faces", consumes = MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFace(@PathVariable String studentId, @RequestParam("file") MultipartFile file) {
        try {
            faceDataService.uploadSingleImage(studentId, file);
            return ResponseEntity
            FaceData fd = faceDataService.uploadSingleImage(studentId, file);

            // Custom response
            Map<String, Object> response = new HashMap<>();
            response.put("data", fd);
            response.put("status", "success");
            response.put("message", "Face data uploaded successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while uploading face data"));
        }
    }

    // DELETE face data for a student
    @DeleteMapping("/{studentId}/faces/{faceDataId}")
    public ResponseEntity<?> deleteFace(@PathVariable String studentId, @PathVariable Long faceDataId) {
        try {
            faceDataService.delete(studentId, faceDataId);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while deleting face data"));
        }
    }

    // Helper methods for response formatting
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", message);
        response.put("status", "error");
        return response;
    }

    private Map<String, String> createSuccessResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        response.put("status", "success");
        return response;
    }
}