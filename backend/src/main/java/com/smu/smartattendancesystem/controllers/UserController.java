package com.smu.smartattendancesystem.controllers;

import com.smu.smartattendancesystem.dto.*;
import static com.smu.smartattendancesystem.utils.ResponseFormatting.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.smu.smartattendancesystem.services.UserService;
import com.smu.smartattendancesystem.utils.LoggerFacade;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Login API for user table
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        try {
            // Call the login service
            LoginResponse response = userService.login(request.email(), request.password());
            LoggerFacade.info("User logged in successfully: " + request.email());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            LoggerFacade.warning("Login failed for user " + request.email() + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            LoggerFacade.severe("Unexpected error during login for user " + request.email() + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An unexpected error occurred: " + e.getMessage()));
        }
    }
}