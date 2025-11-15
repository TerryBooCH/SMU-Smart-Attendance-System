package com.smu.smartattendancesystem.repositories;

import com.smu.smartattendancesystem.models.Embedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmbeddingRepository extends JpaRepository<Embedding, Long> {

    // Find all embeddings for a given face_data_id
    List<Embedding> findByFaceDataId(Long faceDataId);

    // Find a single embedding by detector + recognizer + face_data_id
    Optional<Embedding> findByDetectorAndRecognizerAndFaceDataId(
            String detector, String recognizer, Long faceDataId
    );

    // Find all embeddings for a detector and recognizer
    List<Embedding> findByDetectorAndRecognizer(String detector, String recognizer);
}
