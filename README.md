# SMU Smart Attendance System

**Smart Attendance System** is a Java-based application that automates attendance management using face recognition technology. It supports student enrollment, real-time session tracking, automatic/manual attendance marking, reporting, and an intuitive GUI.

---

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Project-Structure](#project-structure)

---

## Features

- Real-time face recognition for attendance  
- Automatic and manual attendance marking  
- Student and session management  
- Export attendance reports in CSV, PDF, and Excel  
- Configurable system settings  

---

## Technologies

- Java 17+  
- Spring Boot (backend services)  
- React (frontend user interface)  
- OpenCV (optional for face recognition)  
- Maven (project and dependency management)  

---

## Architecture

The system follows a **client-server architecture**:
- **Backend**: Spring Boot provides RESTful APIs for managing students, sessions, and attendance records.  
- **Frontend**: React is used to build a modern, responsive UI for students, teachers, and administrators.  
- **Database**: (e.g., MySQL/PostgreSQL) stores student data, session information, and attendance logs.  
- **Integration**: Face recognition (via OpenCV) is integrated into the backend service layer.  

---

## Project Structure

A Maven multi-module structure is used:
smu-smart-attendance-system/
│
├── backend/               # Spring Boot application
│   ├── src/main/java/     # Java source files
│   ├── src/main/resources/# Configurations (application.properties, etc.)
│   └── pom.xml            # Backend dependencies
│
├── frontend/              # React application
│   ├── public/            # Static files
│   ├── src/               # React components, pages, services
│   └── package.json       # Frontend dependencies
│
├── pom.xml                # Parent POM (manages modules and common configs)
└── README.md              # Project documentation

