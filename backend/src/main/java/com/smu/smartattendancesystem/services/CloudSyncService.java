package com.smu.smartattendancesystem.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smu.smartattendancesystem.config.DatabaseConfig;
import com.smu.smartattendancesystem.connector.CloudConnector;
import com.smu.smartattendancesystem.managers.StudentManager;
import com.smu.smartattendancesystem.models.Student;

@Service
public class CloudSyncService {

    private static final Logger logger = LoggerFactory.getLogger(CloudSyncService.class);

    private final CloudConnector cloudConnector;
    private final StudentManager studentManager;
    private final DatabaseConfig databaseConfig;

    public CloudSyncService(CloudConnector cloudConnector, 
                           StudentManager studentManager,
                           DatabaseConfig databaseConfig) {
        this.cloudConnector = cloudConnector;
        this.studentManager = studentManager;
        this.databaseConfig = databaseConfig;
    }

    /**
     * This method runs automatically after the application has started
     */
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void syncOnStartup() {
        if (!databaseConfig.isSyncOnStartup()) {
            logger.info("Cloud sync on startup is disabled");
            return;
        }

        logger.info("=== Starting Cloud Sync ===");
        if (databaseConfig.isPersistentMode()) {
            logger.info("Persistent mode: Two-way sync with Firebase");
        } else {
            logger.info("Syncing from Firebase (cloud primary)");
        }

        try {
            if (databaseConfig.isPersistentMode()) {
                syncPersistentMode();
            } else {
                syncFromCloud();
            }
        } catch (Exception e) {
            logger.error("Failed to sync with cloud on startup", e);
        }

        logger.info("=== Cloud Sync Complete ===");
    }

    /**
     * Sync from Cloud: Download ALL data from Firebase to SQLite
     */
    private void syncFromCloud() {
        logger.info("🔄 Downloading all data from Firebase...");

        try {
            // Download all students from Firebase
            List<Map<String, Object>> cloudStudents = cloudConnector.getAllEntities("students");
            logger.info("Found {} students in Firebase", cloudStudents.size());

            int successCount = 0;
            for (Map<String, Object> studentData : cloudStudents) {
                try {
                    // Convert Map to Student object
                    Student student = mapToStudent(studentData);
                    
                    // Save to local SQLite
                    studentManager.addStudent(student);
                    successCount++;
                    
                    logger.debug("Downloaded student: {}", student.getStudentId());
                } catch (Exception e) {
                    logger.error("Failed to download student: {}", studentData.get("studentId"), e);
                }
            }

            logger.info("✅ Successfully downloaded {} students to local database", successCount);

        } catch (Exception e) {
            logger.error("❌ Failed to download data from Firebase", e);
        }
    }

    /**
     * Persistent Mode: Two-way sync with conflict resolution
     */
    private void syncPersistentMode() {
        logger.info("🔄 PERSISTENT MODE: Two-way sync with Firebase...");

        try {
            // Get all local students
            List<Student> localStudents = studentManager.getAllStudents();
            logger.info("Found {} students in local database", localStudents.size());

            // Get all cloud students
            List<Map<String, Object>> cloudStudents = cloudConnector.getAllEntities("students");
            logger.info("Found {} students in Firebase", cloudStudents.size());

            // Create a map for quick lookup
            Map<String, Map<String, Object>> cloudStudentMap = new HashMap<>();
            for (Map<String, Object> cloudStudent : cloudStudents) {
                String studentId = (String) cloudStudent.get("studentId");
                cloudStudentMap.put(studentId, cloudStudent);
            }

            // 1. Upload local students that don't exist in cloud
            int uploadedCount = 0;
            for (Student localStudent : localStudents) {
                if (!cloudStudentMap.containsKey(localStudent.getStudentId())) {
                    uploadStudentToCloud(localStudent);
                    uploadedCount++;
                    logger.debug("⬆️ Uploaded new student to cloud: {}", localStudent.getStudentId());
                }
            }
            logger.info("⬆️ Uploaded {} new students to Firebase", uploadedCount);

            // 2. Download cloud students that don't exist locally
            int downloadedCount = 0;
            for (Map<String, Object> cloudStudent : cloudStudents) {
                String studentId = (String) cloudStudent.get("studentId");
                
                if (studentManager.getStudentByStudentId(studentId).isEmpty()) {
                    Student student = mapToStudent(cloudStudent);
                    studentManager.addStudent(student);
                    downloadedCount++;
                    logger.debug("⬇️ Downloaded new student from cloud: {}", studentId);
                }
            }
            logger.info("⬇️ Downloaded {} new students from Firebase", downloadedCount);

            // 3. Conflict resolution for students that exist in both
            // Strategy: Cloud data wins (you can change this logic)
            int updatedCount = 0;
            for (Student localStudent : localStudents) {
                String studentId = localStudent.getStudentId();
                
                if (cloudStudentMap.containsKey(studentId)) {
                    Map<String, Object> cloudData = cloudStudentMap.get(studentId);
                    
                    // Check if cloud data is different
                    if (isDifferent(localStudent, cloudData)) {
                        updateLocalFromCloud(localStudent, cloudData);
                        updatedCount++;
                        logger.debug("🔄 Updated local student from cloud: {}", studentId);
                    }
                }
            }
            logger.info("🔄 Updated {} students from Firebase", updatedCount);

            logger.info("✅ Two-way sync complete: ⬆️{} uploaded, ⬇️{} downloaded, 🔄{} updated", 
                       uploadedCount, downloadedCount, updatedCount);

        } catch (Exception e) {
            logger.error("❌ Failed to perform two-way sync", e);
        }
    }

    /**
     * Convert Map from Firebase to Student object
     */
    private Student mapToStudent(Map<String, Object> data) {
        Student student = new Student();
        student.setStudentId((String) data.get("studentId"));
        student.setName((String) data.get("name"));
        student.setEmail((String) data.get("email"));
        student.setClassName((String) data.get("className"));
        student.setPhone((String) data.get("phone"));
        return student;
    }

    /**
     * Upload student to cloud
     */
    public void uploadStudentToCloud(Student student) {
        try {
            Map<String, Object> studentData = new HashMap<>();
            studentData.put("studentId", student.getStudentId());
            studentData.put("name", student.getName());
            studentData.put("email", student.getEmail());
            studentData.put("className", student.getClassName());
            studentData.put("phone", student.getPhone());

            cloudConnector.syncEntity("students", student.getStudentId(), studentData);
        } catch (Exception e) {
            logger.error("Failed to upload student to cloud: {}", student.getStudentId(), e);
        }
    }

    /**
     * Check if local and cloud data are different
     */
    private boolean isDifferent(Student local, Map<String, Object> cloud) {
        return !local.getName().equals(cloud.get("name")) ||
               !local.getEmail().equals(cloud.get("email")) ||
               !local.getClassName().equals(cloud.get("className")) ||
               !safeEquals(local.getPhone(), (String) cloud.get("phone"));
    }

    /**
     * Update local student from cloud data
     */
    private void updateLocalFromCloud(Student local, Map<String, Object> cloud) {
        local.setName((String) cloud.get("name"));
        local.setEmail((String) cloud.get("email"));
        local.setClassName((String) cloud.get("className"));
        local.setPhone((String) cloud.get("phone"));
        
        studentManager.updateStudent(local.getStudentId(), local);
    }

    /**
     * Safely compare two strings (handles nulls)
     */
    private boolean safeEquals(String a, String b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.equals(b);
    }

    /**
     * Manual sync method that can be called from API
     */
    @Transactional
    public void manualSync() {
        logger.info("Manual sync triggered by user");
        syncFromCloud();
    }
}