package com.smu.smartattendancesystem.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smu.smartattendancesystem.managers.StudentManager;
import com.smu.smartattendancesystem.managers.UserManager;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.models.User;

@Service
public class StudentService {

    private final StudentManager studentManager;
    private final UserManager userManager;

    public StudentService(StudentManager studentManager, UserManager userManager) {
        this.studentManager = studentManager;
        this.userManager = userManager;
    }

    public List<Student> getAllStudents() {
        return studentManager.getAllStudents();
    }

    public Optional<Student> getStudentByStudentId(String studentId) {
        return studentManager.getStudentByStudentId(studentId);
    }

    @Transactional
    public Student createStudent(Student student) throws IllegalArgumentException, IllegalStateException {
        // Validate input
        if (student == null || student.getStudentId() == null || student.getStudentId().isBlank()) {
            throw new IllegalArgumentException("Student ID is invalid");
        }
        if (student.getEmail() == null || student.getEmail().isBlank()) {
            throw new IllegalArgumentException("Student email is required to create a user account");
        }

        // Check for duplicates
        if (getStudentByStudentId(student.getStudentId()).isPresent()) {
            throw new IllegalStateException("Student already exists with ID: " + student.getStudentId());
        }
        if (userManager.getUserByEmail(student.getEmail()).isPresent()) {
            throw new IllegalStateException("User already exists with email: " + student.getEmail());
        }

        // Save the student to the database
        Student savedStudent = studentManager.addStudent(student);

        // Create a corresponding user account
        String defPassword = student.getStudentId(); // Set default password to studentId
        User newUser = new User(
                savedStudent.getName(),
                savedStudent.getEmail(),
                defPassword,
                0,
                savedStudent);
        newUser.setStudent(savedStudent); // Link user to student
        userManager.createUser(newUser); // Save user to database

        return savedStudent;
    }

    public Student updateStudent(String studentId, Student updatedStudent) {
        return studentManager.updateStudent(studentId, updatedStudent);
    }

    public void deleteStudent(String studentId) {
        studentManager.deleteStudentByStudentId(studentId);
    }
}