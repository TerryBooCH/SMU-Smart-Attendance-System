package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;

@Entity
@Table(name = "course_enrollment")
public class CourseEnrollment extends BaseEntity {

    @ManyToOne // Many Enrollments can belong to one Course
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne // Many Enrollments can belong to one Student
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    private String enrolledAt;

    // Constructors
    public CourseEnrollment() {}

    public CourseEnrollment(Course course, Student student, String enrolledAt) {
        this.course = course;
        this.student = student;
        this.enrolledAt = enrolledAt;
    }

    // Getters & Setters
    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public String getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(String enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

}
