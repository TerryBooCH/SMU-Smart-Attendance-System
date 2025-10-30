package com.smu.smartattendancesystem.connector;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

/**
 * Interface for cloud connector to abstract cloud operations.
 * Allows for easy switching between cloud providers (e.g., Firebase, AWS, etc.).
 */
public interface CloudConnector {

    /**
     * Sync an entity to the cloud.
     * @param collection The collection/table name in the cloud.
     * @param id The unique identifier of the entity.
     * @param data The entity data as a map.
     * @throws ExecutionException If the sync operation fails.
     * @throws InterruptedException If the sync operation is interrupted.
     */
    void syncEntity(String collection, String id, Map<String, Object> data) throws ExecutionException, InterruptedException;

    /**
     * Retrieve an entity from the cloud.
     * @param collection The collection/table name in the cloud.
     * @param id The unique identifier of the entity.
     * @return The entity data as a map, or null if not found.
     * @throws ExecutionException If the retrieval fails.
     * @throws InterruptedException If the retrieval is interrupted.
     */
    Map<String, Object> getEntity(String collection, String id) throws ExecutionException, InterruptedException;

    /**
     * Delete an entity from the cloud.
     * @param collection The collection/table name in the cloud.
     * @param id The unique identifier of the entity.
     * @throws ExecutionException If the deletion fails.
     * @throws InterruptedException If the deletion is interrupted.
     */
    void deleteEntity(String collection, String id) throws ExecutionException, InterruptedException;

    /**
     * Retrieve all entities from a collection.
     * @param collection The collection/table name in the cloud.
     * @return A list of entity data maps.
     * @throws ExecutionException If the retrieval fails.
     * @throws InterruptedException If the retrieval is interrupted.
     */
    List<Map<String, Object>> getAllEntities(String collection) throws ExecutionException, InterruptedException;

    /**
     * Check if an entity exists in the cloud.
     * @param collection The collection/table name in the cloud.
     * @param id The unique identifier of the entity.
     * @return True if exists, false otherwise.
     * @throws ExecutionException If the check fails.
     * @throws InterruptedException If the check is interrupted.
     */
    boolean entityExists(String collection, String id) throws ExecutionException, InterruptedException;
}