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
    public Session createSession(@RequestBody Session session) {
        return sessionService.createSession(session);
    }

    @GetMapping
    public List<Session> getAllSessions() {
        return sessionService.getAllSessions();
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