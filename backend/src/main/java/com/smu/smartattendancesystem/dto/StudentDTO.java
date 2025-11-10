package com.smu.smartattendancesystem.dto;

public class StudentDTO {
    private String studentId;
    private String name;
    private String email;
    private String phone;
    private String className;
    
    public StudentDTO(String studentId, String name, String email, String phone, String className) {
        this.studentId = studentId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.className = className;
    }

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

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }
}
