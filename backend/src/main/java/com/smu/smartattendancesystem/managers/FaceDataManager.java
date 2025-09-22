package com.smu.smartattendancesystem.managers;

import com.smu.smartattendancesystem.models.FaceData;
import com.smu.smartattendancesystem.repositories.FaceDataRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

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
