package com.smu.smartattendancesystem.repositories;

import com.smu.smartattendancesystem.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find a user by email (for login / lookup)
    Optional<User> findByEmail(String email);

    // Find users by name (multiple users may share the same name)
    List<User> findByName(String name);

    // Check if an email is already registered
    boolean existsByEmail(String email);
}
