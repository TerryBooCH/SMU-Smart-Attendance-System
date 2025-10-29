package com.smu.smartattendancesystem.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smu.smartattendancesystem.connector.CloudConnector;
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
    private final CloudConnector cloudConnector;

    public StudentService(StudentManager studentManager, UserManager userManager, FaceDataService faceDataService, CloudConnector cloudConnector) {
        this.studentManager = studentManager;
        this.userManager = userManager;
        this.faceDataService = faceDataService;
        this.cloudConnector = cloudConnector;
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
        // Validate student object
        if (student == null) {
            throw new IllegalArgumentException("Invalid request");
        }

        // Validate student id
        if (student.getStudentId() == null || student.getStudentId().isBlank()) {
            throw new IllegalArgumentException("Student ID is invalid");
        } else if (!student.getStudentId().matches("^[A-Z]\\d{7}$")) {
            throw new IllegalArgumentException(
                    "Student ID must start with one capital letter followed by 7 digits (e.g., S1234567)");
        }

        // Validate name
        if (student.getName() == null || student.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required to create a user account");
        } else if (student.getName().trim().length() < 2) {
            throw new IllegalArgumentException("Name must be at least 2 characters");
        }

        // Validate class (2 letters + 3 digits, e.g., AB123)
        if (student.getClassName() == null || student.getClassName().isBlank()) {
            throw new IllegalArgumentException("Class is required");
        } else if (!student.getClassName().trim().matches("^[A-Z]{2}\\d{3}$")) {
            throw new IllegalArgumentException("Class must start with 2 letters followed by 3 numbers (e.g., AB123)");
        }

        // Validate email (simple format)
        if (student.getEmail() == null || student.getEmail().isBlank()) {
            throw new IllegalArgumentException("Student email is required to create a user account");
        } else if (!student.getEmail().trim().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new IllegalArgumentException("Enter a valid email address");
        }

        // Validate phone (optional, exactly 8 digits if provided)
        if (student.getPhone() != null && !student.getPhone().isBlank()) {
            String phoneTrim = student.getPhone().trim();
            if (!phoneTrim.matches("^\\d+$")) {
                throw new IllegalArgumentException("Phone number must contain only numbers");
            } else if (phoneTrim.length() != 8) {
                throw new IllegalArgumentException("Phone number must be exactly 8 digits");
            }
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

        // Sync to cloud
        try {
            Map<String, Object> studentData = new HashMap<>();
            studentData.put("studentId", savedStudent.getStudentId());
            studentData.put("name", savedStudent.getName());
            studentData.put("email", savedStudent.getEmail());
            studentData.put("className", savedStudent.getClassName());
            studentData.put("phone", savedStudent.getPhone());
            cloudConnector.syncEntity("students", savedStudent.getStudentId(), studentData);
        } catch (ExecutionException | InterruptedException e) {
            // Log error but don't fail the operation
            System.err.println("Failed to sync student to cloud: " + e.getMessage());
        }

        return savedStudent;
    }

    // Initialize user accounts for the students populated in the DB
    @Transactional
    public void initUserAccounts() {
        // Retrieve all students from the database
        List<Student> students = studentManager.getAllStudents();

        for (Student s : students) {
            String defPassword = s.getStudentId(); // Set default password to studentId
            User newUser = new User(
                    s.getName(),
                    s.getEmail(),
                    defPassword,
                    0,
                    s);
            newUser.setStudent(s); // Link user to student
            userManager.createUser(newUser); // Save user to database
        }
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
        if (phone != null) {
            if (phone.isBlank()) {
                // If an empty string is provided, treat it as null
                existingStudent.setPhone(null);
            } else {
                // Validate format (must be exactly 8 digits)
                if (!phone.matches("^\\d{8}$")) {
                    throw new IllegalArgumentException("Phone number must be exactly 8 digits (e.g., 81234567)");
                }
                existingStudent.setPhone(phone.trim());
            }
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