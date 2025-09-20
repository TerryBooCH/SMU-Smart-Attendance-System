package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@MappedSuperclass // Not a table, but extended by tables
public abstract class Entity {

    @Id // Marks the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Uses database's auto-increment to generate IDs
    private Long id;

    @Column(updatable = false) // Once set, can't be changed
    private LocalDateTime createdAt = LocalDateTime.now(); // Current time upon creation

    private LocalDateTime updatedAt = LocalDateTime.now(); // Current time upon creation, can be updated


    @PreUpdate // Called before an update query is executed
    protected void onUpdate() { // Updates the updatedAt timestamp
        updatedAt = LocalDateTime.now();
    }

    // Getters
    public Long getId() { 
        return id; 
    }

    public LocalDateTime getCreatedAt() { 
        return createdAt; 
    }

    public LocalDateTime getUpdatedAt() { 
        return updatedAt; 
    }
}
