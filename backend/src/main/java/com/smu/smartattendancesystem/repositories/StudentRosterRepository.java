package com.smu.smartattendancesystem.repositories;

import com.smu.smartattendancesystem.models.StudentRoster;
import com.smu.smartattendancesystem.models.StudentRosterId;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.models.Roster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRosterRepository extends JpaRepository<StudentRoster, StudentRosterId> {

    // Find a StudentRoster by Student and Roster
    Optional<StudentRoster> findByStudentAndRoster(Student student, Roster roster);

    // Find all rosters a student is enrolled in
    List<StudentRoster> findByStudent(Student student);

    // Find all students in a specific roster
    List<StudentRoster> findByRoster(Roster roster);

    // Check if a student is in a specific roster
    boolean existsByStudentAndRoster(Student student, Roster roster);
}
