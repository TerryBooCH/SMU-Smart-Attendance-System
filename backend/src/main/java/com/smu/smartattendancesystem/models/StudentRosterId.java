package com.smu.smartattendancesystem.models;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class StudentRosterId implements Serializable {

    private Integer studentId;
    private Integer rosterId;

    public StudentRosterId() {}

    public StudentRosterId(Integer studentId, Integer rosterId) {
        this.studentId = studentId;
        this.rosterId = rosterId;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public Integer getRosterId() {
        return rosterId;
    }

    public void setRosterId(Integer rosterId) {
        this.rosterId = rosterId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StudentRosterId)) return false;
        StudentRosterId that = (StudentRosterId) o;
        return Objects.equals(studentId, that.studentId) &&
               Objects.equals(rosterId, that.rosterId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentId, rosterId);
    }
}
