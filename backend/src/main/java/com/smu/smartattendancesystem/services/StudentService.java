package com.smu.smartattendancesystem.services;

import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.repositories.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(String studentId) {
        return studentRepository.findById(studentId);
    }

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student updateStudent(String studentId, Student updatedStudent) {
        if (studentRepository.existsById(studentId)) {
            return studentRepository.save(updatedStudent);
        }
        return null;
    }

    public void deleteStudent(String studentId) {
        studentRepository.deleteById(studentId);
    }
}