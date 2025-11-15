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
- Java JDK (**version: 21**)  
- Apache Maven (**version: 3.9.11**)  

### **Frontend Requirements**
- Node.js (**version: 22.19.0**)  
- npm (**version: <YOUR_NPM_VERSION_HERE>**)  

### **Optional Tools**
- Git (**version: 2.44.0**)  
- IDE (VSCode)

---

## Installing Prerequisites

### **Java JDK (version: 21)**
1. Download JDK 21 (LTS) from: https://www.oracle.com/asean/java/technologies/downloads/#java21
2. Run the installer and install to:
   C:\Program Files\Java\jdk-21
3. Set JAVA_HOME:
   - Open System Properties → Advanced → Environment Variables
   - Add a new system variable:
       JAVA_HOME = C:\Program Files\Java\jdk-21
4. Add Java to PATH:
   - Edit the system variable “Path”
   - Add: %JAVA_HOME%\bin
5. Verify installation:
   java -version
   javac -version
   echo %JAVA_HOME%

### **Apache Maven (version: 3.9.11)**
1. Download the binary ZIP (`apache-maven-3.9.11-bin.zip`) from:  
   https://maven.apache.org/download.cgi
2. Extract the ZIP to a folder, for example: `C:\Program Files\Apache\maven\apache-maven-3.9.11`

#### **Adding Maven to PATH**

After installing Maven, you need to add it to your system PATH. Using the following file path (`C:\Program Files\Apache\maven\apache-maven-3.9.11`) as an example:

**Windows:**
1. Open **System Properties** → **Advanced** → **Environment Variables**
2. Under **System Variables**, click **New** and add:
   - Variable name: `M2_HOME`
   - Variable value: `C:\Program Files\Apache\maven\apache-maven-3.9.11`
3. Click **OK** to save changes
4. Add Maven to the PATH under **System Variables**:
   - Select the `Path` variable and click **Edit**
   - Click **New** and add: `%M2_HOME%\bin` or `C:\Program Files\Apache\maven\apache-maven-3.9.11\bin`
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

### **Node.js & npm (version: 22.19.0)**
1. Download Node.js LTS from https://nodejs.org
2. Install and ensure "Add to PATH" is checked
3. Open a new command prompt and verify: `node -v` and `npm -v`

### **Git (Optional) (version: 2.44.0)**
1. Download Git for Windows installer from:  
   https://git-scm.com/download/win
2. Run the installer and keep the **default options** (this will install Git Bash and add Git to PATH).
3. After installation, open **Command Prompt** or **Git Bash** and verify:
   ```bash
   git --version
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
mvn dependency:resolve
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

Backend will start at: `http://localhost:<8080>`

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

### **Database Behavior**
By default, the backend uses an SQLite database located in `attendance.db`. No setup, installation, or configuration needed, and it starts automatically when the backend starts.

#### **First Run (Initialize Schema)**
To create the database schema for the first time:
- Set `spring.jpa.hibernate.ddl-auto=create`
- Run the backend once (Hibernate will generate all tables)
- After the schema is created, switch back to persistent mode

#### **Persistent Mode (Recommended for normal use)**
To ensure that your data will not reset on each restart:
- Set `spring.jpa.hibernate.ddl-auto=none`  
  → Prevents Hibernate from recreating or modifying tables
- Set `spring.sql.init.mode=never`  
  → Prevents Spring from re-running `schema.sql` / `data.sql`

#### **Reset the Database**
If you want to wipe everything and recreate the schema:
1. Delete `attendance.db`
2. Set: `spring.jpa.hibernate.ddl-auto=create`
3. Set: `spring.sql.init.mode=always`
4. Run the backend once  
5. Switch back to: `spring.jpa.hibernate.ddl-auto=none`
6. Switch back to: `spring.sql.init.mode=never`

---