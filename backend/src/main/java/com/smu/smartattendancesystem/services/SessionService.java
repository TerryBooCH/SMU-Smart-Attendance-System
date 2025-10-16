package com.smu.smartattendancesystem.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.smu.smartattendancesystem.managers.SessionManager;
import com.smu.smartattendancesystem.managers.RosterManager;
import com.smu.smartattendancesystem.models.Roster;
import com.smu.smartattendancesystem.models.Session;

import jakarta.persistence.EntityNotFoundException;

@Service
public class SessionService {
    private final SessionManager sessionManager;
    private final RosterManager rosterManager;

    public SessionService(SessionManager sessionManager, RosterManager rosterManager) {
        this.sessionManager = sessionManager;
        this.rosterManager = rosterManager;
    }

    // Create session (auto-set date if missing)
    public Session createSession(Session session) {
        if (session.getStartAt() == null) {
            session.setStartAt(LocalDateTime.now());
        }
        return sessionManager.createSession(session);
    }

    // Get all sessions
    public List<Session> getAllSessions() {
        return sessionManager.getAllSessions();
    }

    // Open a session
    public Session openSession(Long id) {
        Session session = sessionManager.getSession(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setOpen(true);
        return sessionManager.updateSession(session);
    }

    // Close a session
    public Session closeSession(Long id) {
        Session session = sessionManager.getSession(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setOpen(false);
        return sessionManager.updateSession(session);
    }

    // Delete a session (cannot delete if open)
    public void deleteSession(Long id) {
        Session session = sessionManager.getSession(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        if (session.isOpen()) {
            throw new IllegalStateException("Cannot delete an active session.");
        }
        sessionManager.deleteSession(id);
    }

    // Link a roster to a session
    public Session linkRosterToSession(Long sessionId, Long rosterId) {
        Optional<Session> sessionOpt = sessionManager.getSession(sessionId);
        Optional<Roster> rosterOpt = rosterManager.getRoster(rosterId);

        if (sessionOpt.isEmpty() || rosterOpt.isEmpty()) {
            if (sessionOpt.isEmpty()) throw new EntityNotFoundException("Session not found");
            if (rosterOpt.isEmpty()) throw new EntityNotFoundException("Roster not found");
        }

        Session session = sessionOpt.get();
        session.setRoster(rosterOpt.get());
        return sessionManager.updateSession(session);
    }
}
