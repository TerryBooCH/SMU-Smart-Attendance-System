package com.smu.smartattendancesystem.managers;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.smu.smartattendancesystem.models.User;
import com.smu.smartattendancesystem.repositories.UserRepository;

@Service
public class UserManager {
    private final UserRepository userRepo;

    public UserManager(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    // CREATE: Register a new user
    // Use case: user signs up
    public User createUser(User user) {
        return userRepo.save(user);
    }

    // READ: Get user by ID
    // Use case: lookup by primary key
    public Optional<User> getUser(Long id) {
        return userRepo.findById(id);
    }

    // READ: Get user by email (for login)
    // Use case: authentication / lookup
    public Optional<User> getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    // READ: List all users
    // Use case: admin viewing all accounts
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    // Get permission level by user ID
    // Use case: check user permissions without loading entire user object
    public Optional<Integer> getPermissionLevelById(Long id) {
        return userRepo.findById(id)
                .map(User::getPermissionLevel);
    }

    // UPDATE: Update user details
    // Use case: user changes profile info
    public User updateUser(User user) {
        return userRepo.save(user);
    }

    // DELETE: Remove a user
    // Use case: admin deletes an account
    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }

    // COUNT: Get total number of users
    public long getUserCount() {
        return userRepo.count();
    }
}
