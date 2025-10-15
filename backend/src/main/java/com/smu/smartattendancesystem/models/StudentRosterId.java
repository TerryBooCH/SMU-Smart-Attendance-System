package com.smu.smartattendancesystem.models;

import java.io.Serializable;
import java.util.Objects;

public class StudentRosterId implements Serializable {
    private Long student;
    private Long roster;

    public StudentRosterId() {
    }

    public StudentRosterId(Long student, Long roster) {
        this.student = student;
        this.roster = roster;
    }

    // hashCode & equals required for composite key
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof StudentRosterId))
            return false;
        StudentRosterId that = (StudentRosterId) o;
        return Objects.equals(student, that.student) && Objects.equals(roster, that.roster);
    }

    @Override
    public int hashCode() {
        return Objects.hash(student, roster);
    }
}
