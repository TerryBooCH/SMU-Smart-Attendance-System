package com.smu.smartattendancesystem.services;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LocalImageStorage implements ImageStorage {

    private final Path root; // File path to root directory for storing images

    // Constructor
    public LocalImageStorage(@Value("${faces.root}") String rootDir) {

        // Resolve the root directory path
        this.root = Paths.get(rootDir).toAbsolutePath().normalize();

        // Create the root directory if it does not exist
        if (this.root != null) {
            try {
                Files.createDirectories(this.root);
            } catch (IOException e) {
                throw new UncheckedIOException("Cannot create storage directory: " + this.root, e);
            }
        }

    }

    /**
     * Save an image for a student under {faces.root}/{studentId}/.
     *
     * @param studentId used as the subfolder name
     * @param file      uploaded image (JPEG/PNG)
     * @return relative path like "S1234567A/uuid.jpg" (store this in DB)
     * @throws IOException if writing fails
     */
    @Override
    public String save(String studentId, MultipartFile file) throws IOException, IllegalArgumentException {

        // Validate parameters
        if (studentId == null || studentId.isBlank()) {
            throw new IllegalArgumentException("studentId is required");
        }

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("file is empty");
        }

        // Validate file type (JPEG or PNG)
        String contentType = String.valueOf(file.getContentType()).toLowerCase();
        String fileName = String.valueOf(file.getOriginalFilename()).toLowerCase();

        boolean isPng = contentType.equals("image/png") || fileName.endsWith(".png");
        boolean isJpg = contentType.equals("image/jpeg") || contentType.equals("image/jpg")
                || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg");

        if (!(isPng || isJpg)) {
            throw new IllegalArgumentException("Only JPEG or PNG images are allowed");
        }

        // Decide file extension
        String extension;
        if (isPng) {
            extension = ".png";
        } else {
            extension = ".jpg";
        }

        // Create subdirectory for the student {root}/{studentId}/
        Path studentDir = root.resolve(studentId).normalize(); // resolve the student directory path
        if (!studentDir.startsWith(root)) {
            throw new SecurityException("Invalid studentId path");
        }
        Files.createDirectories(studentDir);

        // Generate a unique filename using UUID
        String filename = UUID.randomUUID().toString() + extension;

        // Target path to store the image
        Path targetPath = studentDir.resolve(filename).normalize();

        if (!targetPath.startsWith(root)) {
            throw new SecurityException("Invalid file path");
        }

        // Attempt to save the target file
        try {
            // Save the file to the target location
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Return the relative path like "S1234567A/uuid.jpg"
            return studentId + "/" + filename;

        } catch (IOException e) {
            throw new IOException("Failed to store file " + filename, e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to store file " + filename, e);
        } finally {
            file.getInputStream().close();
        }

    }

    /**
     * Delete an image by its relative path (e.g., "S1234567A/uuid.jpg").
     *
     * @param relativePath relative path to the image to delete
     * @throws IOException if deletion fails unexpectedly
     */
    @Override
    public void delete(String relativePath) throws IOException {

        // Validate parameter
        if (relativePath == null || relativePath.isBlank()) {
            throw new IllegalArgumentException("relativePath is required");
        }

        // Resolve the target path
        Path targetPath = root.resolve(relativePath).normalize();

        if (!targetPath.startsWith(root)) {
            throw new SecurityException("Invalid file path");
        }

        // Attempt to delete the file if it exists
        try {
            Files.deleteIfExists(targetPath);
        } catch (IOException e) {
            throw new IOException("Failed to delete file " + relativePath, e);
        }

    }

    /**
     * Reads an image file by its relative path and returns its bytes.
     *
     * @param relativePath path like "S1234567A/uuid.jpg"
     * @return byte array of the image
     * @throws IOException if the file cannot be read
     */
    public byte[] read(String relativePath) throws IOException {
        if (relativePath == null || relativePath.isBlank()) {
            throw new IllegalArgumentException("relativePath is required");
        }

        // Resolve the full file path inside the root directory
        Path targetPath = root.resolve(relativePath).normalize();

        if (!targetPath.startsWith(root)) {
            throw new SecurityException("Invalid file path");
        }

        // Check if file exists
        if (!Files.exists(targetPath)) {
            throw new IOException("File not found: " + targetPath);
        }

        // Read and return bytes of the image to be converted to base64
        System.out.println("Reading file: " + targetPath);
        return Files.readAllBytes(targetPath);
    }

    /**
     * Delete the entire folder for a student's face images:
     * {faces.root}/{studentId}/
     *
     * @param studentId subfolder to delete
     * @throws IOException if deletion fails unexpectedly
     */
    public void deleteFolder(String studentId) throws IOException {
        // Validate parameters
        if (studentId == null || studentId.isBlank()) {
            throw new IllegalArgumentException("studentId is required");
        }

        // Resolve the student directory path
        Path studentDir = root.resolve(studentId).normalize();

        // Security check to prevent directory traversal attacks
        if (!studentDir.startsWith(root)) {
            throw new SecurityException("Invalid studentId path");
        }

        File folder = studentDir.toFile();

        // If folder does not exist, do nothing
        if (!folder.exists()) {
            return;
        }

        // Delete the directory
        try {
            FileUtils.deleteDirectory(folder);
        } catch (IOException e) {
            throw new IOException("Failed to delete folder for student: " + studentId, e);
        }
    }
}
