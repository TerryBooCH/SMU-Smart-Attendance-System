package com.smu.smartattendancesystem.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PreUpdate;

@MappedSuperclass // Not a table, but extended by tables
public abstract class BaseEntity {

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

    // Getters and setter
    public Long getId() { 
        return id; 
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() { 
        return createdAt; 
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() { 
        return updatedAt; 
    }
}
