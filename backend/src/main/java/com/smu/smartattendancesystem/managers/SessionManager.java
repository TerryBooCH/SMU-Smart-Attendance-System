package com.smu.smartattendancesystem.managers;

import com.smu.smartattendancesystem.models.Session;
import com.smu.smartattendancesystem.repositories.SessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SessionManager {
    private final SessionRepository sessionRepo;

    public SessionManager(SessionRepository sessionRepo) {
        this.sessionRepo = sessionRepo;
    }

    // CREATE: Schedule a new session
    // Use case: lecturer creates lecture/lab session
    public Session createSession(Session session) {
        return sessionRepo.save(session);
    }

    // READ: Get session by ID
    // Use case: get details of a specific class
    public Optional<Session> getSession(Long id) {
        return sessionRepo.findById(id);
    }

    // READ: List all sessions
    // Use case: admin/lecturer views timetable
    public List<Session> getAllSessions() {
        return sessionRepo.findAll();
    }

    // UPDATE: Update session details
    // Use case: change time, room, or lecturer
    public Session updateSession(Session session) {
        return sessionRepo.save(session);
    }

    // DELETE: Cancel a session
    // Use case: class canceled or merged
    public void deleteSession(Long id) {
        sessionRepo.deleteById(id);
    }
}
