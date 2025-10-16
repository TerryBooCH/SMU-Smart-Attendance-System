package com.smu.smartattendancesystem.dto;

import com.smu.smartattendancesystem.models.Student;

public class StudentWithFaceDTO {
    private String studentId;
    private String name;
    private String email;
    private String phone;
    private FaceDataDTO face; // can be null if no face data

    public StudentWithFaceDTO() {
    }

    public StudentWithFaceDTO(String studentId, String name, String email, String phone, FaceDataDTO face) {
        this.studentId = studentId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.face = face;
    }

    public static StudentWithFaceDTO from(Student student, FaceDataDTO face) {
        return new StudentWithFaceDTO(
                student.getStudentId(),
                student.getName(),
                student.getEmail(),
                student.getPhone(),
                face);
    }

    // Getters and setters
    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public FaceDataDTO getFace() {
        return face;
    }

    public void setFace(FaceDataDTO face) {
        this.face = face;
    }
}
