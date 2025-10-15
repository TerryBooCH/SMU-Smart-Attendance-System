package com.smu.smartattendancesystem.managers;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.smu.smartattendancesystem.models.Roster;
import com.smu.smartattendancesystem.repositories.RosterRepository;

@Component
public class RosterManager {
    private final RosterRepository rosterRepository;

    public RosterManager(RosterRepository rosterRepository) {
        this.rosterRepository = rosterRepository;
    }

    // CREATE
    public Roster createRoster(Roster roster) {
        return rosterRepository.save(roster);
    }

    // READ
    public Optional<Roster> getRoster(Long id) {
        return rosterRepository.findById(id);
    }

    // READ ALL
    public List<Roster> getAllRosters() {
        return rosterRepository.findAll();
    }

    // UPDATE
    public Roster updateRoster(Roster roster) {
        return rosterRepository.save(roster);
    }

    // DELETE
    public void deleteRoster(Long id) {
        rosterRepository.deleteById(id);
    }
}
