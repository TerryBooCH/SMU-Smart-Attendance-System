package com.smu.smartattendancesystem.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smu.smartattendancesystem.models.User;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find a user by email (for login / lookup)
    Optional<User> findByEmail(String email);

    // Find users by name (multiple users may share the same name)
    List<User> findByName(String name);

    // Check if an email is already registered
    boolean existsByEmail(String email);

    Optional<User> findByStudentId(Long studentId);
}
