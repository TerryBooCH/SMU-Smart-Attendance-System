package com.smu.smartattendancesystem.repositories;

import com.smu.smartattendancesystem.models.FaceData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FaceDataRepository extends JpaRepository<FaceData, Long> {

    // Find by studentId (link face embeddings to student)
    FaceData findByStudent_StudentId(String studentId);
}
