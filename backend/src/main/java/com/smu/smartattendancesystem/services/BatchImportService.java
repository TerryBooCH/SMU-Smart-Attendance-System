package com.smu.smartattendancesystem.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.repositories.StudentRepository;

@Service
public class BatchImportService {

    @Autowired
    private StudentRepository studentRepository;

    public void importStudentsFromCsv(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream()))) {

            String line;
            reader.readLine(); // Skip header
            while ((line = reader.readLine()) != null) {

                if (line.trim().isEmpty()) continue; // Skip empty lines

                String[] parts = line.split(",");
                if (parts.length < 4) continue;

                String studentId = parts[0].trim();
                String name = parts[1].trim();
                String email = parts[2].trim();
                String phone = parts[3].trim();

                // skip if duplicate
                if (studentRepository.findByStudentId(studentId).isPresent() ||
                    studentRepository.findByEmail(email).isPresent()) {
                    System.out.println("Duplicate student found: " + studentId + " or " + email);
                    continue; // skip duplicates
                }

                Student student = new Student(studentId, name, email, phone);
                studentRepository.save(student);
                
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to read CSV file", e);
        }
    }
}