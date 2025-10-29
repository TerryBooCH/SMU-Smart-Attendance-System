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
import com.smu.smartattendancesystem.utils.LoggerFacade;

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
            System.out.println(
                    "=== Creating Student: " + student.getStudentId() + " | Class: " + student.getClassName() + " ===");

            Student createdStudent = studentService.createStudent(student);
            LoggerFacade.info("Enrolled Student " + createdStudent.getStudentId() + ".");
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(createdStudent);
        } catch (IllegalArgumentException e) {
            LoggerFacade.warning("Failed to create student: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            LoggerFacade.warning("Conflict while creating student: " + e.getMessage());
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
            LoggerFacade.severe("Unexpected error while creating student: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while creating student"));
        }
    }

    // READ all
    @GetMapping
    public ResponseEntity<?> getAllStudents() {
        try {
            LoggerFacade.info("Fetched all students.");
            return ResponseEntity.ok(studentService.getAllStudents());
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while fetching students: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while fetching students"));
        }
    }

    // READ one by studentId
    @GetMapping("/{studentId}")
    public ResponseEntity<?> getStudent(@PathVariable String studentId) {
        try {
            StudentWithFaceDTO dto = studentService.getStudentByStudentId(studentId);
            LoggerFacade.info("Fetched Student " + studentId + ".");
            return ResponseEntity.ok(dto);
        } catch (NoSuchElementException e) {
            LoggerFacade.warning("Student not found: " + studentId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while fetching student " + studentId + ": " + e.getMessage());
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
            LoggerFacade.info("Updated Student " + studentId + ".");
            return ResponseEntity.ok(dto);
        } catch (NoSuchElementException e) {
            LoggerFacade.warning("Failed to update — Student not found: " + studentId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            LoggerFacade.warning("Invalid update for Student " + studentId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            LoggerFacade.warning("Conflict while updating Student " + studentId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while updating student " + studentId + ": " + e.getMessage());
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
            LoggerFacade.info("Deleted Student " + studentId + ".");
            return ResponseEntity.ok(createSuccessResponse("Student deleted successfully"));
        } catch (NoSuchElementException e) {
            LoggerFacade.warning("Failed to delete — Student not found: " + studentId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Student not found with ID: " + studentId));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while deleting student " + studentId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while deleting the student"));
        }
    }

    // READ face data for a student
    @GetMapping("/{studentId}/faces")
    public ResponseEntity<?> listFaces(@PathVariable String studentId) {
        try {
            LoggerFacade.info("Listed face data for Student " + studentId + ".");
            return ResponseEntity.ok(faceDataService.list(studentId));
        } catch (NoSuchElementException e) {
            LoggerFacade.warning("Failed to list faces — Student not found: " + studentId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while listing faces for Student " + studentId + ": " + e.getMessage());
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

            LoggerFacade.info("Uploaded " + files.size() + " face images for Student " + studentId + ".");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (NoSuchElementException e) {
            LoggerFacade.warning("Failed to upload faces — Student not found: " + studentId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException | IllegalStateException e) {
            LoggerFacade.warning("Failed to upload faces for Student " + studentId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while uploading faces for Student " + studentId + ": " + e.getMessage());
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
            LoggerFacade.info("Deleted face data (ID: " + faceDataId + ") for Student " + studentId + ".");
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            LoggerFacade.warning("Failed to delete face data (ID: " + faceDataId + ") — Student not found: " + studentId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while deleting face data (ID: " + faceDataId + ") for Student " + studentId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while deleting face data"));
        }
    }

    // READ students by name (for search bar)
    @GetMapping(params = "name")
    public ResponseEntity<?> searchStudentsByName(@RequestParam("name") String name) {
        try {
            List<StudentWithFaceDTO> results = studentService.searchStudentsWithOneFace(name);
            LoggerFacade.info("Searched students by name: " + name + ".");
            return ResponseEntity.ok(results);
        } catch (IllegalArgumentException e) {
            LoggerFacade.warning("Invalid search query: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error while searching for students by name (" + name + "): " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred while searching for students"));
        }
    }
}
