package com.smu.smartattendancesystem.services;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorage {

    // Save an image for a student
    String save(String studentId, MultipartFile file) throws IOException;

    // Delete an student's image by its relative path
    void delete(String relativePath) throws IOException;
}
