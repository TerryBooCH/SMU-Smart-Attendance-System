package com.smu.smartattendancesystem.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.smu.smartattendancesystem.managers.StudentManager;
import com.smu.smartattendancesystem.models.Student;

@Service
public class StudentService {

    private final StudentManager studentManager;

    public StudentService(StudentManager studentManager) {
        this.studentManager = studentManager;
    }

    public List<Student> getAllStudents() {
        return studentManager.getAllStudents();
    }

    public Optional<Student> getStudentByStudentId(String studentId) {
        return studentManager.getStudentByStudentId(studentId);
    }

    public Student createStudent(Student student) {
        return studentManager.addStudent(student);
    }

    public Student updateStudent(String studentId, Student updatedStudent) {
        return studentManager.updateStudent(studentId, updatedStudent);
    }

    public void deleteStudent(String studentId) {
        studentManager.deleteStudentByStudentId(studentId);
    }
}