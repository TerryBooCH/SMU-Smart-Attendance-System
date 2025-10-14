package com.smu.smartattendancesystem.managers;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.repositories.StudentRepository;

@Service
public class StudentManager {
    private final StudentRepository studentRepo;

    public StudentManager(StudentRepository studentRepo) {
        this.studentRepo = studentRepo;
    }

    // CREATE: Add a new student
    public Student addStudent(Student student) {
        return studentRepo.save(student);
    }

    // READ: Get student by primary key (Long id)
    public Optional<Student> getStudentById(Long id) {
        return studentRepo.findById(id);
    }

    // READ: Get student by business ID (String studentId)
    public Optional<Student> getStudentByStudentId(String studentId) {
        return studentRepo.findByStudentId(studentId);
    }

    // READ: Get all students
    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    // READ: Get student by name (partial query, case insensitive)
    public List<Student> searchByName(String name) {
        return studentRepo.findByNameContainingIgnoreCase(name);
    }

    // READ: Get student by email
    public Optional<Student> getStudentByEmail(String email) {
        return studentRepo.findByEmail(email);
    }
    
    // Get all students in a specific class
    public List<Student> getStudentsByClassName(String className) {
        return studentRepo.findByClassNameIgnoreCase(className);
    }

    // UPDATE: Update existing student
    public Student updateStudent(String studentId, Student student) {
        return studentRepo.save(student);
    }

    // DELETE: Remove a student by primary key
    public void deleteStudent(Long id) {
        studentRepo.deleteById(id);
    }

    // DELETE: Remove a student by business ID
    public void deleteStudentByStudentId(String studentId) {
        studentRepo.findByStudentId(studentId).ifPresent(student -> {
            studentRepo.delete(student);
        });
    }
}