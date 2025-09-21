package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;

@Entity
@Table(name = "course")
public class Course extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String code;

    private String title;

    // Getters & Setters
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
