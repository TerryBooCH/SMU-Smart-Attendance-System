package com.smu.smartattendancesystem.dto;

import java.time.LocalDateTime;
import java.util.Base64;

import com.smu.smartattendancesystem.models.FaceData;
import com.smu.smartattendancesystem.services.LocalImageStorage;

public class FaceDataDTO {

    private Long id;
    private String studentId;
    private String studentName;
    private String imageBase64;
    private String imagePath;
    private LocalDateTime createdAt;

    // Default constructor for Jackson
    public FaceDataDTO() {
    }

    // Constructor from entity
    public FaceDataDTO(FaceData faceData, LocalImageStorage storage) {
        this.id = faceData.getId();
        this.imagePath = faceData.getImagePath();
        this.createdAt = faceData.getCreatedAt();
        this.studentId = faceData.getStudent().getStudentId();
        this.studentName = faceData.getStudent().getName();

        // Read and encode the image
        try {
            byte[] imageBytes = storage.read(faceData.getImagePath());
            this.imageBase64 = "data:image/jpeg;base64," +
                    Base64.getEncoder().encodeToString(imageBytes);
        } catch (Exception e) {
            this.imageBase64 = null; // handle missing file gracefully
        }
    }

    // Static factory method for cleaner code
    public static FaceDataDTO fromEntity(FaceData fd, LocalImageStorage storage) {
        return new FaceDataDTO(fd, storage);
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}
