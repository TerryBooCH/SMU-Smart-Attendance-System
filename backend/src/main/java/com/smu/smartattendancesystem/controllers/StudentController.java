package com.smu.smartattendancesystem.controllers;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

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

import com.smu.smartattendancesystem.dto.StudentWithFaceDTO;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.services.FaceDataService;
import com.smu.smartattendancesystem.services.StudentService;
import static com.smu.smartattendancesystem.utils.ResponseFormatting.createErrorResponse;
import static com.smu.smartattendancesystem.utils.ResponseFormatting.createSuccessResponse;

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
    public ResponseEntity<?> addStudent(@RequestBody Student student) {
        try {
            // Log for debugging
            System.out.println(
                    "=== Creating Student: " + student.getStudentId() + " | Class: " + student.getClassName() + " ===");

            Student createdStudent = studentService.createStudent(student);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(createdStudent);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            String msg = e.getMessage();
            String field = null;

            if (msg.contains("email")) {
                field = "email";
            } else if (msg.contains("ID")) {
                field = "studentId";
            }

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse(e.getMessage(), field));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while creating student"));
        }
    }

    // READ all
    @GetMapping
    public ResponseEntity<?> getAllStudents() {
        try {
            return ResponseEntity.ok(studentService.getAllStudents());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while fetching students"));
        }
    }

    // READ one by studentId
    @GetMapping("/{studentId}")
    public ResponseEntity<?> getStudent(@PathVariable String studentId) {
        try {
            StudentWithFaceDTO dto = studentService.getStudentByStudentId(studentId);
            return ResponseEntity.ok(dto);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while fetching the student"));
        }
    }

    // UPDATE by studentId
    @PutMapping("/{studentId}")
    public ResponseEntity<?> updateStudent(@PathVariable String studentId,
            @RequestBody Student student) {
        try {
            StudentWithFaceDTO dto = studentService.updateStudent(studentId, student);
            return ResponseEntity.ok(dto);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while updating the student"));
        }
    }

    // DELETE by studentId
    @DeleteMapping("/{studentId}")
    public ResponseEntity<?> deleteStudent(@PathVariable String studentId) {
        System.out.println("=== DELETE Student Called with ID: " + studentId + " ===");
        try {
            studentService.deleteStudent(studentId);
            return ResponseEntity.ok(createSuccessResponse("Student deleted successfully"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Student not found with ID: " + studentId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while deleting the student"));
        }
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
    public ResponseEntity<?> uploadFace(@PathVariable String studentId,
            @RequestParam("file") List<MultipartFile> files) {
        try {
            var dtos = faceDataService.uploadImages(studentId, files);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("message", "Face data uploaded successfully");
            response.put("status", "success");
            response.put("data", dtos);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
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

    // READ students by name (for search bar)
    @GetMapping(params = "name")
    public ResponseEntity<?> searchStudentsByName(@RequestParam("name") String name) {
        try {
            List<StudentWithFaceDTO> results = studentService.searchStudentsWithOneFace(name);
            return ResponseEntity.ok(results);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while searching for students"));
        }
    }
}
