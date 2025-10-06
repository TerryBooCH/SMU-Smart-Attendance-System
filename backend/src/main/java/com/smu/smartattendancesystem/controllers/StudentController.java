package com.smu.smartattendancesystem.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.services.StudentService;

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
}