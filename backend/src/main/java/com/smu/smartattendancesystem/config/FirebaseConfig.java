package com.smu.smartattendancesystem.config;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.service-account.path}")
    private String serviceAccountPath;

    @Value("${firebase.project-id}")
    private String projectId;

    @Bean
    public Firestore firestore() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            InputStream serviceAccount = getClass().getResourceAsStream("/firebase-service-account.json");

            if (serviceAccount == null) {
                throw new IOException("Firebase service account file not found at: " + serviceAccountPath);
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setProjectId(projectId)
                    .build();

            FirebaseApp.initializeApp(options);

        }

        return FirestoreClient.getFirestore();
    }
}
