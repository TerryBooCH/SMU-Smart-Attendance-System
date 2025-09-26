package com.smu.smartattendancesystem.controllers;

import com.smu.smartattendancesystem.services.StudentService;
import com.smu.smartattendancesystem.models.Student;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/students") 
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
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
        return studentService.getStudentById(studentId);
    }

    // UPDATE by studentId
    @PutMapping("/{studentId}")
    public Student updateStudent(@PathVariable String studentId, @RequestBody Student student) {
        System.out.println("=== UPDATE Student Called with ID: " + studentId + " ===");
        Optional<Student> existingStudentOpt = studentService.getStudentById(studentId);
        
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
        Optional<Student> student = studentService.getStudentById(studentId);
        
        if (student.isEmpty()) {
            throw new RuntimeException("Student not found with ID: " + studentId);
        }
        
        studentService.deleteStudent(student.get().getStudentId());
        return "Student deleted successfully";
    }
}