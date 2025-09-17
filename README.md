# SMU Smart Attendance System

**Smart Attendance System** is a Java-based application that automates attendance management using face recognition technology. It supports student enrollment, real-time session tracking, automatic/manual attendance marking, reporting, and an intuitive GUI.

---

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Setup-and-Build](#setup-and-build)

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

## Setup and Build

1. Download the Maven **Binary zip archive**.  
2. Verify installation with:  
   ```bash
   mvn --version
   ```
3. Install all project dependencies:
   ```bash
   mvn dependency:resolve
   ```
4. After writing or modifying code (Java classes, etc.), compile everything with:
   ```bash
   mvn clean compile
   ```