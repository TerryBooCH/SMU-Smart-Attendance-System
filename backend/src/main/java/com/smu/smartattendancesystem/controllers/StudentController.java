package com.smu.smartattendancesystem.controllers;

import com.smu.smartattendancesystem.managers.StudentManager;
import com.smu.smartattendancesystem.models.Student;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/students") // Changed to avoid conflicts
public class StudentController {
    private final StudentManager studentManager;

    public StudentController(StudentManager studentManager) {
        this.studentManager = studentManager;
    }

    // CREATE
    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentManager.addStudent(student);
    }

    // READ all
    @GetMapping
    public List<Student> getAllStudents() {
        return studentManager.getAllStudents();
    }

    // READ one by studentId
    @GetMapping("/{studentId}")
    public Optional<Student> getStudent(@PathVariable String studentId) {
        System.out.println("=== GET Student Called with ID: " + studentId + " ===");
        return studentManager.getStudentByStudentId(studentId);
    }

    // UPDATE by studentId
    @PutMapping("/{studentId}")
    public Student updateStudent(@PathVariable String studentId, @RequestBody Student student) {
        System.out.println("=== UPDATE Student Called with ID: " + studentId + " ===");
        Optional<Student> existingStudentOpt = studentManager.getStudentByStudentId(studentId);
        
        if (existingStudentOpt.isEmpty()) {
            throw new RuntimeException("Student not found with ID: " + studentId);
        }
        
        Student existingStudent = existingStudentOpt.get();
        existingStudent.setName(student.getName());
        existingStudent.setEmail(student.getEmail());
        existingStudent.setPhone(student.getPhone());
        
        return studentManager.updateStudent(existingStudent);
    }

    // DELETE by studentId
    @DeleteMapping("/{studentId}")
    public String deleteStudent(@PathVariable String studentId) {
        System.out.println("=== DELETE Student Called with ID: " + studentId + " ===");
        Optional<Student> student = studentManager.getStudentByStudentId(studentId);
        
        if (student.isEmpty()) {
            throw new RuntimeException("Student not found with ID: " + studentId);
        }
        
        studentManager.deleteStudent(student.get().getId());
        return "Student deleted successfully";
    }
}