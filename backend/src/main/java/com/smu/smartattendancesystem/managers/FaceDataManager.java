package com.smu.smartattendancesystem.managers;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.smu.smartattendancesystem.models.FaceData;
import com.smu.smartattendancesystem.repositories.FaceDataRepository;

@Service
public class FaceDataManager {
    private final FaceDataRepository faceRepo;

    public FaceDataManager(FaceDataRepository faceRepo) {
        this.faceRepo = faceRepo;
    }

    // CREATE: Add face data for a student
    // Use case: student registers face for attendance system
    public FaceData addFaceData(FaceData faceData) {
        return faceRepo.save(faceData);
    }

    // READ: Get face data by ID
    // Use case: retrieve image/embedding for recognition
    public Optional<FaceData> getFaceData(Long id) {
        return faceRepo.findById(id);
    }

    public List<FaceData> listByStudentId(String studentId) {
        return faceRepo.findAllByStudent_StudentId(studentId);
    }

    public long countByStudentId(String studentId) {
        return faceRepo.countByStudent_StudentId(studentId);
    }

    public Optional<FaceData> getByIdAndStudentId(Long id, String studentId) {
        return faceRepo.findByIdAndStudent_StudentId(id, studentId);
    }

    // UPDATE: Update face data
    // Use case: student re-registers due to image quality issues
    public FaceData updateFaceData(FaceData faceData) {
        return faceRepo.save(faceData);
    }

    // DELETE: Remove face data
    // Use case: student leaves school, data cleanup
    public void deleteFaceData(Long id) {
        faceRepo.deleteById(id);
    }
}
