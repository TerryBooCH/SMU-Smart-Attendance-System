package com.smu.smartattendancesystem.managers;

import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.repositories.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentManager {
    private final StudentRepository studentRepo;

    public StudentManager(StudentRepository studentRepo) {
        this.studentRepo = studentRepo;
    }

    // CREATE: Add a new student
    // Use case: enrollment, onboarding new students
    public Student addStudent(Student student) {
        return studentRepo.save(student);
    }

    // READ: Get student by ID
    // Use case: view student profile
    public Optional<Student> getStudentById(String studentId) {
        return studentRepo.findById(studentId);
    }

    // READ: Get all students
    // Use case: admin listing all students
    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    // UPDATE: Update existing student
    // Use case: change email, phone, or class group
    public Student updateStudent(Student student) {
        return studentRepo.save(student);
    }

    // DELETE: Remove a student by ID
    // Use case: student leaves institution
    public void deleteStudent(String studentId) {
        studentRepo.deleteById(studentId);
    }
}
