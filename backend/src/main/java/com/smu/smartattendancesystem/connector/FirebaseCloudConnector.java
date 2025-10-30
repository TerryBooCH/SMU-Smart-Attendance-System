package com.smu.smartattendancesystem.connector;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;

/**
 * Firebase implementation of the CloudConnector interface using Firestore.
 */
@Component
public class FirebaseCloudConnector implements CloudConnector {

    private final Firestore firestore;

    public FirebaseCloudConnector(Firestore firestore) {
        this.firestore = firestore;
    }

    @Override
    public void syncEntity(String collection, String id, Map<String, Object> data) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(collection).document(id);
        ApiFuture<WriteResult> future = docRef.set(data);
        future.get(); // Wait for completion
    }

    @Override
    public Map<String, Object> getEntity(String collection, String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(collection).document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
        return document.exists() ? document.getData() : null;
    }

    @Override
    public void deleteEntity(String collection, String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(collection).document(id);
        ApiFuture<WriteResult> future = docRef.delete();
        future.get(); // Wait for completion
    }

    @Override
    public List<Map<String, Object>> getAllEntities(String collection) throws ExecutionException, InterruptedException {
        CollectionReference colRef = firestore.collection(collection);
        ApiFuture<QuerySnapshot> future = colRef.get();
        QuerySnapshot querySnapshot = future.get();
        return querySnapshot.getDocuments().stream()
                .map(DocumentSnapshot::getData)
                .collect(Collectors.toList());
    }

    @Override
    public boolean entityExists(String collection, String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(collection).document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
        return document.exists();
    }
}
