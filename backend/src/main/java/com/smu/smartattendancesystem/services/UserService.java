package com.smu.smartattendancesystem.services;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.smu.smartattendancesystem.dto.LoginResponse;
import com.smu.smartattendancesystem.managers.UserManager;
import com.smu.smartattendancesystem.models.User;

@Service
public class UserService {

    private final UserManager userManager;
    private final JwtService jwtService;

    public UserService(UserManager userManager, JwtService jwtService) throws IllegalArgumentException {
        this.userManager = userManager;
        this.jwtService = jwtService;
    }

    public LoginResponse login(String email, String password) {

        // Validate user input
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            throw new IllegalArgumentException("Email and password must be provided");
        }

        // Retrive user by email
        Optional<User> optUser = userManager.getUserByEmail(email);
        User user;
        if (optUser.isPresent()) {
            user = optUser.get();
        } else {
            throw new IllegalArgumentException("Invalid email or password"); // Invalid email
        }

        // Validate password
        if (!user.checkPassword(password)) {
            throw new IllegalArgumentException("Invalid email or password"); // Invalid password
        }

        // Generate JWT token
        String token = jwtService.generateToken(user);

        // Build user info to be returned
        Map<String, Object> userInfo = new LinkedHashMap<>();
        userInfo.put("name", user.getName());
        userInfo.put("email", user.getEmail());
        userInfo.put("permissionLevel", user.getPermissionLevel());

        String linkedStudentId = user.getLinkedStudentId(); // may be null
        if (linkedStudentId != null && !linkedStudentId.isBlank()) {
            userInfo.put("studentId", linkedStudentId);
        }

        return new LoginResponse(token, jwtService.getExpirationMs(), "Bearer", userInfo);
    }
}
