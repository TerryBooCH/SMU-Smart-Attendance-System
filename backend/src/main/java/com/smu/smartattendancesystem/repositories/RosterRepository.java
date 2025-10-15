package com.smu.smartattendancesystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.smu.smartattendancesystem.models.Roster;

@Repository
public interface RosterRepository extends JpaRepository<Roster, Long> {
    Roster findByName(String name);
}
