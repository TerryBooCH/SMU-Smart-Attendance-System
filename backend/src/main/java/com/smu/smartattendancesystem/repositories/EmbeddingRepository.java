package com.smu.smartattendancesystem.repositories;

import com.smu.smartattendancesystem.models.Embedding;
import com.smu.smartattendancesystem.models.FaceData;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmbeddingRepository extends JpaRepository<Embedding, Long> {

    // Find all embeddings for a given face_data
    List<Embedding> findByFaceData(FaceData faceData);

    // Find a single embedding by detector + recognizer + face_data
    Optional<Embedding> findByDetectorAndRecognizerAndFaceData(
            String detector, String recognizer, FaceData faceData
    );

    // Find all embeddings for a detector and recognizer
    List<Embedding> findByDetectorAndRecognizer(String detector, String recognizer);
}
