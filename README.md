# SMU Smart Attendance System

**Smart Attendance System** is a Java-based application that automates attendance management using face recognition technology. It supports student enrollment, real-time session tracking, automatic/manual attendance marking, reporting, and an intuitive GUI.

## Overview
The **Smart Attendance System** is a full-stack web application built with:

- **Frontend:** React + TailwindCSS  
- **Backend:** Spring Boot  
- **Build Tools:** Maven (backend), Node.js + npm/yarn (frontend)

This system provides automated attendance tracking, user management, and seamless communication between the frontend and backend.  
The backend uses a **runtime database** that **starts automatically when the backend application starts**—no manual setup or external database installation required.

---

## Table of Contents
1. [Project Structure](#project-structure)  
2. [Prerequisites](#prerequisites)  
3. [Installing Prerequisites](#installing-prerequisites)  
   - [Node.js & npm](#nodejs--npm)
   - [Java JDK](#java-jdk)
   - [Apache Maven](#apache-maven)
   - [Git (Optional)](#git-optional)
4. [Environment Variables](#environment-variables)  
5. [Setting Up the Application](#setting-up-the-application)  
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)  
   - [Run Backend](#run-backend)
   - [Run Frontend](#run-frontend)
7. [Additional Notes](#additional-notes)

---

## Project Structure
```
SMU-Smart-Attendance-System/
│
├── backend/                # Spring Boot Application
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── frontend/               # React + TailwindCSS UI
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## Prerequisites

### **Backend Requirements**
- Java JDK (**version: <YOUR_JDK_VERSION_HERE>**)  
- Apache Maven (**version: <YOUR_MAVEN_VERSION_HERE>**)  

### **Frontend Requirements**
- Node.js (**version: <YOUR_NODE_VERSION_HERE>**)  
- npm (**version: <YOUR_NPM_VERSION_HERE>**)  

### **Optional Tools**
- Git (**version: <YOUR_GIT_VERSION_HERE>**)  
- IDE (VSCode)

---

## Installing Prerequisites

### **Java JDK**
<YOUR_INSTALLATION_INSTRUCTIONS_HERE>

### **Apache Maven**
<YOUR_INSTALLATION_INSTRUCTIONS_HERE>

### **Node.js & npm**
<YOUR_INSTALLATION_INSTRUCTIONS_HERE>

### **Git (Optional)**
<YOUR_INSTALLATION_INSTRUCTIONS_HERE>

---

## Environment Variables

The frontend requires a `.env` file for configuration.  
An example file (`.env.example`) is provided.

Create your environment file:
```bash
cd frontend
cp .env.example .env
```

Update the `.env` file with your backend API URL:
```env
VITE_API_URL=<YOUR_BACKEND_API_URL>
```

---

## Setting Up the Application

### **Backend Setup**
Install backend dependencies:
```bash
cd backend
mvn clean install
```

### **Frontend Setup**
Install dependencies:
```bash
cd frontend
npm install
```

---

## Running the Application

### **Run Backend**
```bash
cd backend
mvn spring-boot:run
```

Backend will start at: `http://localhost:<PORT>`

### **Run Frontend**
```bash
cd frontend
npm run dev
```

Frontend will run at: `http://localhost:5173`

Make sure the `.env` file contains the correct backend API URL.

---

## Additional Notes

### **Runtime Database**
The backend uses a runtime (in-memory) database, meaning:
- It starts automatically when the backend starts
- No setup, installation, or configuration needed
- Data resets every time the backend restarts
- To add persistence to the backend: <INSERT_STEPS_HERE>

---