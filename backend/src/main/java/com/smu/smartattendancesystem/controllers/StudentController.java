package com.smu.smartattendancesystem.controllers;

import com.smu.smartattendancesystem.managers.StudentManager;
import com.smu.smartattendancesystem.models.Student;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/students")
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

    // READ one
    @GetMapping("/{id}")
    public Optional<Student> getStudent(@PathVariable String id) {
        return studentManager.getStudentById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable String id, @RequestBody Student student) {
        student.setStudentId(id); // ensure correct ID
        return studentManager.updateStudent(student);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable String id) {
        studentManager.deleteStudent(id);
    }
}
