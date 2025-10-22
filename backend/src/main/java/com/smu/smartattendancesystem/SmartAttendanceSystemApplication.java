package com.smu.smartattendancesystem;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.smu.smartattendancesystem.models.User;
import com.smu.smartattendancesystem.repositories.UserRepository;

@SpringBootApplication
public class SmartAttendanceSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartAttendanceSystemApplication.class, args);
	}

	@Bean
    CommandLineRunner initDatabase(UserRepository userRepo) {
        return args -> {
            if (userRepo.count() == 0) {
				BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                userRepo.save(new User("professor1", "prof1@gmail.com", encoder.encode("password123"), 2));
                userRepo.save(new User("ta1", "ta1@gmail.com", encoder.encode("password123"), 0));
                System.out.println("Default users successfully created in SQLite database.");
            }
        };
    }
}