package com.smu.smartattendancesystem.managers;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.repositories.StudentRepository;

@Component
public class StudentManager {

    private final StudentRepository studentRepository;

    public StudentManager(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    public Optional<Student> findById(String studentId) {
        return studentRepository.findById(studentId);
    }

    public Student enroll(Student student) {
        return studentRepository.save(student);
    }

    public Student update(String studentId, Student updatedStudent) {
        if (studentRepository.existsById(studentId)) {
            return studentRepository.save(updatedStudent);
        }
        return null;
    }

    public void remove(String studentId) {
        studentRepository.deleteById(studentId);
    }
}