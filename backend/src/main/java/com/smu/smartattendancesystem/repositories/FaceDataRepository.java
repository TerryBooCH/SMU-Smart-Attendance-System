package com.smu.smartattendancesystem.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smu.smartattendancesystem.models.FaceData;

@Repository
public interface FaceDataRepository extends JpaRepository<FaceData, Long> {

    // Retrieve all face data entries for a student
    List<FaceData> findAllByStudent_StudentId(String studentId);

    // Return count of face data entries for student
    long countByStudent_StudentId(String studentId);

    // Retrieve specific face data by its ID and associated studentId
    Optional<FaceData> findByIdAndStudent_StudentId(Long id, String studentId);
    
    // Retrieve latest face data for student
    Optional<FaceData> findFirstByStudent_StudentIdOrderByCreatedAtDesc(String studentId);
}
