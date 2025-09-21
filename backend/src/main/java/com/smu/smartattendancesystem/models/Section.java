package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;

@Entity
@Table(name = "section")
public class Section extends BaseEntity {

    @ManyToOne // Many sections can correspond to one Course
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private String sectionCode;
    private String term;
    private String schedule;

    // Getters & Setters
    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public String getSectionCode() {
        return sectionCode;
    }

    public void setSectionCode(String sectionCode) {
        this.sectionCode = sectionCode;
    }

    public String getTerm() {
        return term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    public String getSchedule() {
        return schedule;
    }

    public void setSchedule(String schedule) {
        this.schedule = schedule;
    }
}
