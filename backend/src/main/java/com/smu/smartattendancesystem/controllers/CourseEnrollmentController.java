package com.smu.smartattendancesystem.controllers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smu.smartattendancesystem.dto.CourseEnrollmentDTO;
import com.smu.smartattendancesystem.models.CourseEnrollment;
import com.smu.smartattendancesystem.services.CourseEnrollmentService;

@RestController
@RequestMapping("/api/enrollments")
public class CourseEnrollmentController {
    
    private final CourseEnrollmentService enrollmentService;
    
    public CourseEnrollmentController(CourseEnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }
    
    /**
     * POST /api/enrollments/enroll
     * Enroll a student in a course
     * Body: { "studentId": "S12345", "courseId": 1 }
     */
    @PostMapping("/enroll")
    public ResponseEntity<?> enrollStudent(@RequestBody Map<String, Object> request) {
        try {
            String studentId = (String) request.get("studentId");
            Long courseId = Long.valueOf(request.get("courseId").toString());
            
            CourseEnrollment enrollment = enrollmentService.enrollStudent(studentId, courseId);
            CourseEnrollmentDTO dto = new CourseEnrollmentDTO(enrollment);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid request: " + e.getMessage()));
        }
    }
    
    /**
     * GET /api/enrollments
     * Get all enrollments
     */
    @GetMapping
    public ResponseEntity<List<CourseEnrollmentDTO>> getAllEnrollments() {
        List<CourseEnrollment> enrollments = enrollmentService.getAllEnrollments();
        List<CourseEnrollmentDTO> dtos = enrollments.stream()
                .map(CourseEnrollmentDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * GET /api/enrollments/{id}
     * Get specific enrollment by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getEnrollment(@PathVariable Long id) {
        return enrollmentService.getEnrollment(id)
                .<ResponseEntity<?>>map(enrollment -> ResponseEntity.ok(new CourseEnrollmentDTO(enrollment)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Enrollment not found: " + id)));
    }
    
    /**
     * GET /api/enrollments/student/{studentId}
     * Get all courses a student is enrolled in
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CourseEnrollmentDTO>> getStudentEnrollments(@PathVariable String studentId) {
        List<CourseEnrollment> enrollments = enrollmentService.getStudentEnrollments(studentId);
        List<CourseEnrollmentDTO> dtos = enrollments.stream()
                .map(CourseEnrollmentDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * GET /api/enrollments/course/{courseId}
     * Get all students enrolled in a course (roster)
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CourseEnrollmentDTO>> getCourseEnrollments(@PathVariable Long courseId) {
        List<CourseEnrollment> enrollments = enrollmentService.getCourseEnrollments(courseId);
        List<CourseEnrollmentDTO> dtos = enrollments.stream()
                .map(CourseEnrollmentDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * DELETE /api/enrollments/{id}
     * Unenroll a student (drop course)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEnrollment(@PathVariable Long id) {
        try {
            enrollmentService.deleteEnrollment(id);
            return ResponseEntity.ok(Map.of("message", "Enrollment deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * GET /api/enrollments/check?studentId=S12345&courseId=1
     * Check if student is enrolled in course
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkEnrollment(
            @RequestParam String studentId,
            @RequestParam Long courseId) {
        boolean isEnrolled = enrollmentService.isStudentEnrolled(studentId, courseId);
        return ResponseEntity.ok(Map.of("enrolled", isEnrolled));
    }
}