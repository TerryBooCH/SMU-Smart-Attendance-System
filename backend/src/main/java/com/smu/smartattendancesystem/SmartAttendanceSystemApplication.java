package com.smu.smartattendancesystem;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.smu.smartattendancesystem.services.StudentService;

@SpringBootApplication
public class SmartAttendanceSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartAttendanceSystemApplication.class, args);
    }

    // Ensures the start up scripts only run after SpringBoot finishes
    // initialization
    @Bean
    CommandLineRunner init(StudentService studentService) {
        return args -> studentService.initUserAccounts();
    }

}
