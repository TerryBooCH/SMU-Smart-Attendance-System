package com.smu.smartattendancesystem.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smu.smartattendancesystem.dto.SessionDTO;
import com.smu.smartattendancesystem.models.Session;
import com.smu.smartattendancesystem.services.SessionService;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {
    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public SessionDTO createSession(@RequestBody Session session) {
        Session savedSession = sessionService.createSession(session);

        return new SessionDTO(
            savedSession.getId(),
            savedSession.getCreatedAt(),
            savedSession.getUpdatedAt(),
            savedSession.getCourseName(),
            savedSession.getStartAt(),
            savedSession.getEndAt(),
            savedSession.isOpen(),
            savedSession.getLateAfterMinutes(),
            savedSession.getRoster() != null ? savedSession.getRoster().getId() : null,
            savedSession.getRoster() != null ? savedSession.getRoster().getName() : null
        );
    }

    @GetMapping
    public List<SessionDTO> getAllSessions() {
        return sessionService.getAllSessions().stream()
            .map(session -> new SessionDTO(
                session.getId(),
                session.getCreatedAt(),
                session.getUpdatedAt(),
                session.getCourseName(),
                session.getStartAt(),
                session.getEndAt(),
                session.isOpen(),
                session.getLateAfterMinutes(),
                session.getRoster() != null ? session.getRoster().getId() : null,
                session.getRoster() != null ? session.getRoster().getName() : null
            ))
            .toList();
    }

    @PutMapping("/{id}/open")
    public Session openSession(@PathVariable Long id) {
        return sessionService.openSession(id);
    }

    @PutMapping("/{id}/close")
    public Session closeSession(@PathVariable Long id) {
        return sessionService.closeSession(id);
    }

    @DeleteMapping("/{id}")
    public void deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
    }

    // Endpoint to link a roster to a session
    @PutMapping("/{id}/roster/{rosterId}")
    public Session linkRosterToSession(
            @PathVariable Long id,
            @PathVariable Long rosterId) {
        return sessionService.linkRosterToSession(id, rosterId);
    }
}