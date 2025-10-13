package com.smu.smartattendancesystem.services;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.smu.smartattendancesystem.managers.SessionManager;
import com.smu.smartattendancesystem.models.Session;
import com.smu.smartattendancesystem.models.Student;
import com.smu.smartattendancesystem.repositories.StudentRepository;

@Service
public class SessionService {
    private final SessionManager sessionManager;
    private final StudentRepository studentRepository;

    public SessionService(SessionManager sessionManager, StudentRepository studentRepository) {  
        this.sessionManager = sessionManager;
        this.studentRepository = studentRepository; 
    }

    public Session createSession(Session session) {
        // Set date to today if not provided
        if (session.getStartAt() == null) {
            session.setStartAt(java.time.LocalDateTime.now());
        }
        return sessionManager.createSession(session);
    }

    public List<Session> getAllSessions() {
        return sessionManager.getAllSessions();
    }

    public Session openSession(Long id) {
        Session session = sessionManager.getSession(id).orElseThrow();
        session.setOpen(true);
        return sessionManager.updateSession(session);
    }

    public Session closeSession(Long id) {
        Session session = sessionManager.getSession(id).orElseThrow();
        session.setOpen(false);
        return sessionManager.updateSession(session);
    }

    public void deleteSession(Long id) {
        Session session = sessionManager.getSession(id).orElseThrow();
        if (session.isOpen()) {
            throw new IllegalStateException("Cannot delete an active session.");
        }
        sessionManager.deleteSession(id);
    }

    public Session updateRoster(Long id, List<Long> studentIds) {
        Session session = sessionManager.getSession(id)
            .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        
        // Prevent roster changes for active sessions
        if (session.isOpen()) {
            throw new IllegalStateException("Cannot modify roster of an active session.");
        }
        
        // Validate no duplicates in input
        Set<Long> uniqueIds = new HashSet<>(studentIds);
        if (uniqueIds.size() != studentIds.size()) {
            throw new IllegalArgumentException("Duplicate student IDs in request");
        }

        // Fetch and validate all students exist
        List<Student> validatedStudents = new ArrayList<>();
        for (Long studentId : studentIds) {
            Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found: " + studentId));
            validatedStudents.add(student);
        }

        // Update session roster
        session.getRoster().clearRoster();
        session.getRoster().addAllStudents(validatedStudents);
        
        return sessionManager.updateSession(session);
    }

    public Session addStudentToRoster(Long sessionId, Long studentId) {
        Session session = sessionManager.getSession(sessionId)
            .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        
        if (session.isOpen()) {
            throw new IllegalStateException("Cannot modify roster of an active session.");
        }
        
        // Fetch student from StudentRepository
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Student not found: " + studentId));
        
        // Add to roster with duplicate check
        if (!session.getRoster().addToRoster(student)) {
            throw new IllegalArgumentException("Student already in roster or invalid");
        }
        
        return sessionManager.updateSession(session);
    }

    public Session removeStudentFromRoster(Long sessionId, Long studentId) {
        Session session = sessionManager.getSession(sessionId)
            .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        
        if (session.isOpen()) {
            throw new IllegalStateException("Cannot modify roster of an active session.");
        }
        
        if (!session.getRoster().removeFromRoster(studentId)) {
            throw new IllegalArgumentException("Student not found in roster");
        }
        
        return sessionManager.updateSession(session);
    }
}