package com.smu.smartattendancesystem.services;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smu.smartattendancesystem.dto.FaceDataDTO;
import com.smu.smartattendancesystem.dto.StudentWithFaceDTO;
import com.smu.smartattendancesystem.managers.StudentManager;
import com.smu.smartattendancesystem.managers.UserManager;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.models.User;

@Service
public class StudentService {

    private final StudentManager studentManager;
    private final UserManager userManager;
    private final FaceDataService faceDataService;

    public StudentService(StudentManager studentManager, UserManager userManager, FaceDataService faceDataService) {
        this.studentManager = studentManager;
        this.userManager = userManager;
        this.faceDataService = faceDataService;
    }

    public List<StudentWithFaceDTO> getAllStudents() {

        // Retrieve all students
        List<Student> students = studentManager.getAllStudents();

        // Retrieve one face data for each student if available
        List<StudentWithFaceDTO> results = new ArrayList<>();

        for (Student s : students) {
            // Retrieve latest face data for the student
            FaceDataDTO face = faceDataService.getLatestFaceData(s.getStudentId())
                    .orElse(null); // returns null if no face data exists for the student

            // Create the DTO object combining student and face data
            StudentWithFaceDTO dto = StudentWithFaceDTO.from(s, face);

            results.add(dto);
        }

        return results;
    }

    public StudentWithFaceDTO getStudentByStudentId(String studentId) {

        // Retrieve student by studentId
        Optional<Student> optStudent = studentManager.getStudentByStudentId(studentId);
        if (optStudent.isEmpty()) {
            throw new NoSuchElementException("Student not found: " + studentId);
        }

        Student student = optStudent.get();

        // Retrieve latest face data for a student
        FaceDataDTO face = faceDataService.getLatestFaceData(student.getStudentId())
                .orElse(null);

        // Create and return the DTO object combining student and face data
        return StudentWithFaceDTO.from(student, face);
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
        if (studentManager.getStudentByStudentId(student.getStudentId()).isPresent()) {
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

    public StudentWithFaceDTO updateStudent(String studentId, Student student) {

        // Validate if student exists
        Optional<Student> optStudent = studentManager.getStudentByStudentId(studentId);
        if (optStudent.isEmpty()) {
            throw new NoSuchElementException("Student not found: " + studentId);
        }
        Student existingStudent = optStudent.get();

        // Validate inputs (name, email, class)
        if (student.getName() == null || student.getName().isBlank()) {
            throw new IllegalArgumentException("Student name cannot be empty");
        }

        if (student.getEmail() == null || student.getEmail().isBlank()) {
            throw new IllegalArgumentException("Student email cannot be empty");
        }

        if (student.getClassName() == null || student.getClassName().isBlank()) {
            throw new IllegalArgumentException("Student class name cannot be empty");
        }

        // Phone is optional, so only if its provided, then check if its in a valid
        // format
        String phone = student.getPhone();
        if (phone != null && !phone.isBlank()) {
            if (!phone.matches("^\\d{8}$")) {
                throw new IllegalArgumentException("Phone number must be exactly 8 digits (e.g., 81234567)");
            } 
            existingStudent.setPhone(phone.trim());
        }

        // Ensure email is not used by another student
        Optional<Student> emailOwner = studentManager.getStudentByEmail(student.getEmail());
        if (emailOwner.isPresent() && !emailOwner.get().getId().equals(existingStudent.getId())) {
            throw new IllegalStateException("Student with this email already exists");
        }

        // Apply updates to student
        existingStudent.setName(student.getName().trim());
        existingStudent.setEmail(student.getEmail().trim());
        existingStudent.setClassName(student.getClassName().trim());

        Student savedStudent = studentManager.updateStudent(studentId, existingStudent);

        // Sync new username and email to linked user account
        User user = savedStudent.getUser();
        user.setName(savedStudent.getName());
        user.setEmail(savedStudent.getEmail());

        userManager.updateUser(user);

        // Create and return the DTO object combining student and face data
        FaceDataDTO face = faceDataService.getLatestFaceData(savedStudent.getStudentId())
                .orElse(null);
        return StudentWithFaceDTO.from(savedStudent, face);
    }

    public void deleteStudent(String studentId) {

        // Validate if student exists
        Optional<Student> optStudent = studentManager.getStudentByStudentId(studentId);
        if (optStudent.isEmpty()) {
            throw new NoSuchElementException("Student not found: " + studentId);
        }
        Student existingStudent = optStudent.get();

        // Delete face data tied to the student
        faceDataService.deleteAllImagesByStudentId(studentId);

        // Delete user account tied to the student
        userManager.deleteUser(existingStudent.getId());

        // Delete student account
        studentManager.deleteStudentByStudentId(existingStudent.getStudentId());
    }

    // Search students by name (partial match, case insensitive)
    @Transactional(readOnly = true)
    public List<Student> searchStudentsByName(String name) {

        // Validate input
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Please provide a name.");
        }

        // Remove trailing spaces
        String query = name.trim();

        return studentManager.searchByName(query);
    }

    // Search students by name, and include one face data if available
    @Transactional(readOnly = true)
    public List<StudentWithFaceDTO> searchStudentsWithOneFace(String name) {

        // Get students with matching names to the query
        List<Student> students = searchStudentsByName(name);

        // Retrieve one face data for each student if available
        List<StudentWithFaceDTO> results = new ArrayList<>();

        for (Student s : students) {
            // Retrieve latest face data for the student
            FaceDataDTO face = faceDataService.getLatestFaceData(s.getStudentId())
                    .orElse(null); // returns null if no face data exists for the student

            // Create the DTO object combining student and face data
            StudentWithFaceDTO dto = StudentWithFaceDTO.from(s, face);

            results.add(dto);
        }

        return results;
    }

    // Get all students in a class (with face data)
    @Transactional(readOnly = true)
    public List<StudentWithFaceDTO> getStudentsByClassName(String className) {
        List<Student> students = studentManager.getStudentsByClassName(className);
        List<StudentWithFaceDTO> results = new ArrayList<>();

        for (Student s : students) {
            FaceDataDTO face = faceDataService.getLatestFaceData(s.getStudentId()).orElse(null);
            results.add(StudentWithFaceDTO.from(s, face));
        }

        return results;
    }
}