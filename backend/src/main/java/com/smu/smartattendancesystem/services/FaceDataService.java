package com.smu.smartattendancesystem.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.smu.smartattendancesystem.dto.FaceDataDTO;
import com.smu.smartattendancesystem.managers.FaceDataManager;
import com.smu.smartattendancesystem.managers.StudentManager;
import com.smu.smartattendancesystem.models.FaceData;
import com.smu.smartattendancesystem.models.Student;

@Service
public class FaceDataService {

    private final LocalImageStorage storage;
    private final FaceDataManager faceManager;
    private final StudentManager studentManager;
    private final int maxImagesPerStudent;

    // Constructor
    public FaceDataService(LocalImageStorage storage, FaceDataManager faceManager,
            StudentManager studentManager,
            @Value("${faces.max-per-student:20}") int maxImagesPerStudent) {
        this.storage = storage;
        this.faceManager = faceManager;
        this.studentManager = studentManager;
        this.maxImagesPerStudent = maxImagesPerStudent;
    }

    // Upload single image for a student
    @Transactional
    public FaceData uploadSingleImage(String studentId, MultipartFile file) throws IOException {

        // Validate if student exists
        Student student;
        Optional<Student> optStudent = studentManager.getStudentByStudentId(studentId);
        if (optStudent.isPresent()) {
            student = optStudent.get();
        } else {
            throw new NoSuchElementException("Student not found: " + studentId);
        }

        // Validate file
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No file provided");
        }

        // Check if max images reached for student
        long currentImageCount = faceManager.countByStudentId(studentId);

        if (currentImageCount >= maxImagesPerStudent) {
            throw new IllegalStateException("Max images reached for student: " + studentId);
        }

        // Save image to local storage
        String relativePath = storage.save(studentId, file);

        // Create FaceData record, and link it to the student
        FaceData fd = new FaceData(relativePath, null); // embedding null for now
        fd.setStudent(student);
        return faceManager.addFaceData(fd);
    }

    // Return list of face data for a student
    @Transactional(readOnly = true)
    public List<FaceDataDTO> list(String studentId) {

        // Validate if student exists
        @SuppressWarnings("unused")
        Student student;
        Optional<Student> optStudent = studentManager.getStudentByStudentId(studentId);
        if (optStudent.isPresent()) {
            student = optStudent.get();
        } else {
            throw new NoSuchElementException("Student not found: " + studentId);
        }

        List<FaceData> faces = faceManager.listByStudentId(studentId);
        List<FaceDataDTO> dtos = new ArrayList<>();
        // Create a DTO for each face data
        for (int i = 0; i < faces.size(); i++) {
            dtos.add(FaceDataDTO.fromEntity(faces.get(i), storage));
        }
        return dtos;
    }

    @Transactional
    public void delete(String studentId, Long faceDataId) throws IOException {
        // Validate if student exists
        Optional<Student> optStudent = studentManager.getStudentByStudentId(studentId);
        if (optStudent.isEmpty()) {
            throw new NoSuchElementException("Student not found: " + studentId);
        }

        // Validate if face data exists and belongs to the student
        Optional<FaceData> optFaceData = faceManager.getByIdAndStudentId(faceDataId, studentId);
        if (optFaceData.isEmpty()) {
            throw new NoSuchElementException(
                    "Face data not found for student: " + studentId + ", faceDataId: " + faceDataId);
        }

        FaceData fd = optFaceData.get();

        // Delete image from local storage
        storage.delete(fd.getImagePath());

        // Delete FaceData record from database
        faceManager.deleteFaceData(faceDataId);
    }

    // Convert FaceData entity to DTO to be returned to frontend
    public FaceDataDTO toDto(FaceData fd) {
        return FaceDataDTO.fromEntity(fd, storage);
    }

    // Batch image upload for a student
}
