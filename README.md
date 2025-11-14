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
   - [Java JDK (version: <YOUR_JDK_VERSION_HERE>)](#java-jdk-version-your_jdk_version_here)
   - [Apache Maven (version: <YOUR_MAVEN_VERSION_HERE>)](#apache-maven-version-your_maven_version_here)
   - [Node.js & npm (version: <YOUR_NODE_VERSION_HERE>)](#nodejs--npm-version-your_node_version_here)
   - [Git (Optional) (version: <YOUR_GIT_VERSION_HERE>)](#git-optional-version-your_git_version_here)
4. [Environment Variables](#environment-variables)  
5. [Setting Up the Application](#setting-up-the-application)  
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)  
   - [Run Backend](#run-backend)
   - [Run Frontend](#run-frontend)
7. [Common Errors](#common-errors)
8. [Additional Notes](#additional-notes)

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

### **Java JDK (version: <YOUR_JDK_VERSION_HERE>)**
<YOUR_INSTALLATION_INSTRUCTIONS_HERE>

### **Apache Maven (version: <YOUR_MAVEN_VERSION_HERE>)**
<YOUR_INSTALLATION_INSTRUCTIONS_HERE>

#### **Adding Maven to PATH**

After installing Maven, you need to add it to your system PATH.

**Windows:**
1. Open **System Properties** → **Advanced** → **Environment Variables**
2. Under **System Variables**, find and select **Path**, then click **Edit**
3. Click **New** and add the path to Maven's `bin` directory (e.g., `C:\apache-maven-<version>\bin`)
4. Click **OK** to save changes
5. Open a new command prompt and verify: `mvn -version`

**macOS/Linux:**
1. Open your shell configuration file:
```bash
   # For bash
   nano ~/.bash_profile
   
   # For zsh
   nano ~/.zshrc
```
2. Add the following lines:
```bash
   export M2_HOME=/path/to/apache-maven-<version>
   export PATH=$M2_HOME/bin:$PATH
```
3. Save the file and reload the configuration:
```bash
   source ~/.bash_profile  # or source ~/.zshrc
```
4. Verify installation: `mvn -version`

### **Node.js & npm (version: <YOUR_NODE_VERSION_HERE>)**
<YOUR_INSTALLATION_INSTRUCTIONS_HERE>

### **Git (Optional) (version: <YOUR_GIT_VERSION_HERE>)**
<YOUR_INSTALLATION_INSTRUCTIONS_HERE>

---

## Environment Variables

The frontend requires a `.env` file for configuration.  
An example file (`.env.example`) is provided with the correct default values.

Create your environment file:
```bash
cd frontend
cp .env.example .env
```

The `.env` file will contain:
```env
VITE_API_URL=<YOUR_BACKEND_API_URL>
```

**Note:** If you are running the backend on the default URL (e.g., `http://localhost:8080`), simply copying `.env.example` to `.env` is sufficient—no modifications are needed. Only edit the `VITE_API_URL` if your backend is running on a different host or port.

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

## Common Errors

### **Error: `JAVA_HOME` not set**
**Cause:** Java JDK not properly installed or environment variable not configured.  
**Fix:** 
```bash
# Windows
setx JAVA_HOME "C:\Program Files\Java\jdk-<version>"

# macOS/Linux
export JAVA_HOME=/path/to/jdk
```

### **Error: `mvn: command not found`**
**Cause:** Maven not installed or not in PATH.  
**Fix:** Verify Maven installation and add to PATH (see [Adding Maven to PATH](#adding-maven-to-path)), then restart terminal.

### **Error: `npm: command not found`**
**Cause:** Node.js/npm not installed or not in PATH.  
**Fix:** Install Node.js from official website or use a package manager.

### **Error: Port already in use**
**Cause:** Another application is using the required port.  
**Fix:** 
- Kill the process using the port
- Change the port in application configuration

### **Error: Cannot connect to backend**
**Cause:** Backend not running or incorrect URL in `.env` file.  
**Fix:** 
- Ensure backend is running
- Verify `VITE_API_URL` in `.env` matches backend URL

### **Error: `Module not found` in frontend**
**Cause:** Dependencies not installed properly.  
**Fix:** 
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Additional Notes

### **Runtime Database**
The backend uses a runtime (in-memory) database, meaning:
- It starts automatically when the backend starts
- No setup, installation, or configuration needed
- Data resets every time the backend restarts
- To add persistence to the backend: <INSERT_STEPS_HERE>

---