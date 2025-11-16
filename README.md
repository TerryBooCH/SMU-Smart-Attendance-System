# SMU Smart Attendance System

**Smart Attendance System** is a Java-based application that automates attendance management using face recognition technology. It supports student enrollment, real-time session tracking, automatic/manual attendance marking, reporting, and an intuitive GUI.

**Repository link**: https://github.com/TerryBooCH/SMU-Smart-Attendance-System

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
   - [Java JDK (version: 21)](#java-jdk-version-21)  
   - [Apache Maven (version: 3911)](#apache-maven-version-3911)  
   - [Node.js & npm (version: 22.19.0, 10.9.3)](#nodejs--npm-version-22190-version-1093)   
   - [Git (Optional) (version: 2.44.0)](#git-optional-version-2440)
4. [Environment Variables](#environment-variables)  
5. [Setting Up the Application](#setting-up-the-application)  
   - [Backend Setup](#backend-setup)  
   - [Frontend Setup](#frontend-setup)
6. [Setting Up the Database](#setting-up-the-database)
7. [Running the Application](#running-the-application)  
   - [Run Backend](#run-backend)  
   - [Run Frontend](#run-frontend)
8. [Login Credentials](#login-credentials)
9. [Model Configurations](#model-configurations)
    - [Detector Model Descriptions](#detector-model-descriptions)
    - [Recognizer Model Descriptions](#recognizer-model-descriptions)
    - [Things to take note](#things-to-take-note)
10. [Common Errors](#common-errors)
11. [Appendix](#appendix)

---

## 1. Project Structure
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

## 2. Prerequisites

### Backend Requirements
- Java JDK (**version: 21**)  
- Apache Maven (**version: 3.9.11**)  

### Frontend Requirements
- Node.js (**version: 22.19.0**)  
- npm (**version: 10.9.3**)  

### Optional Tools
- Git (**version: 2.44.0**)  
- IDE (VSCode)

---

## 3. Installing Prerequisites

### Java JDK (version: 21)
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

### Apache Maven (version: 3.9.11)
1. Download the binary ZIP (`apache-maven-3.9.11-bin.zip`) from:  
   https://maven.apache.org/download.cgi
2. Extract the ZIP to a folder, for example: `C:\Program Files\Apache\maven\apache-maven-3.9.11`

#### Adding Maven to PATH

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

### Node.js & npm (version: 22.19.0, version: 10.9.3)
1. Install Node.js version 22.19.0 from https://nodejs.org (or any closest LTS version that is available)
2. Install and ensure "Add to PATH" is checked
3. Open a new command prompt and verify: `node -v` and `npm -v`

### Git (Optional) (version: 2.44.0)
1. Download Git for Windows installer from:  
   https://git-scm.com/download/win
2. Run the installer and keep the **default options** (this will install Git Bash and add Git to PATH).
3. After installation, open **Command Prompt** or **Git Bash** and verify:
   ```bash
   git --version
---

## 4. Environment Variables

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

## 5. Setting Up the Application

### Backend Setup
Install backend dependencies:
```bash
cd backend
mvn dependency:resolve
mvn clean install
```

### Frontend Setup
Install dependencies:
```bash
cd frontend
npm install
```

---

## 6. Setting Up the Database

The backend uses an SQLite database (attendance.db) that requires no installation or external setup.
However, depending on whether this is your first run or you want persistent data, you must configure the following Spring Boot properties in the `application.properties` file located in `backend/src/main/resources/application.properties`:
```properties
spring.jpa.hibernate.ddl-auto
spring.sql.init.mode
```
These settings control how tables are created and whether sample data is loaded.

### First run (Create Tables & Load Sample Data)
Use this on the very first run or whenever you want to completely regenerate the schema.

In the `application.properties` file, set:
```properties
spring.jpa.hibernate.ddl-auto=create
spring.sql.init.mode=always
```

This will drop existing tables (if any), create new tables, and load the sample data from `data.sql`.

### Persistency (run without resetting existing data)
Use this for subsequent runs after the initial setup, to prevent the database from resetting every time the backend restarts.

In the `application.properties` file, set:
```properties
spring.jpa.hibernate.ddl-auto=none
spring.sql.init.mode=never
```
This will ensure that the schema is not re-created and sample data is not re-loaded, preserving existing data.

### Resetting the Database
To reset the database and reload sample data, you can:
1. Delete the existing `attendance.db` file located in the backend directory.
2. Set the properties to:
```properties
spring.jpa.hibernate.ddl-auto=create
spring.sql.init.mode=always
```     
3. Restart the backend server to recreate the database and load sample data.
4. After the reset, set the database to persistent mode again by changing the properties back to:
```properties
spring.jpa.hibernate.ddl-auto=create
spring.sql.init.mode=always
```     
5. Remove the `.faces` folder located in the `/backend` directory to clear all pre-existing face data stored locally everytime the database is reset.
```
cd .\backend\
rm .\faces\
```

---

## 7. Running the Application

### Run Backend
```bash
cd backend
mvn spring-boot:run
```

Backend will start at: `http://localhost:8080`

### Run Frontend
```bash
cd frontend
npm run dev
```

Frontend will run at: `http://localhost:5173`

Make sure the `.env` file contains the correct backend API URL.

---

## 8. Login Credentials

These accounts are used on the main login page of the app.

- **Professor account**  
  - Email: `dr.lim@example.com`  
  - Password: `prof123`

- **Teaching Assistant account**  
  - Email: `john.lee@example.com`  
  - Password: `ta123`

- **Sample student accounts**  
  By default, each student’s login credentials are:
  - **Email:** the student’s email in the `student` table  
  - **Password:** the student’s `student_id`  

  Example:

  ```text
  Email: lisheng@example.com
  Password: S1000001
    ```

---

## 9. Model Configurations

### Detector Model Descriptions
Recommended detector: **YOLOv8-Face**
| Detector        | Description                                                            | Strengths                                                                  | Weaknesses                                               |
| --------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------- |
| **HaarCascade** | Classical detector using Haar-like features and boosted classifiers.   | • Fast on CPU<br>• Good for frontal faces<br>• Lightweight                 | • Struggles with angled faces<br>• Sensitive to lighting |
| **LBPCascade**  | Uses Local Binary Patterns for texture-based detection.                | • Robust to lighting changes<br>• Very fast<br>• Good for embedded systems | • Lower accuracy vs deep-learning models                 |
| **YOLOv8-Face** | Modern deep learning detector trained specifically for face detection. | • High accuracy<br>• Handles multiple/angled faces<br>• Real-time on GPU   | • Heavier model<br>• Requires more compute               |

### Recognizer Model Descriptions
Recommended recognizer: **Neural Network**
| **Recognizer**     | **Description**                                                                                        | **Strengths**                                                                  | **Weaknesses**                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| **Histogram**      | Compares grayscale intensity histograms to estimate facial similarity.                                 | • Very lightweight<br>• Extremely fast                                         | • Low accuracy<br>• Highly sensitive to lighting and pose                    |
| **EigenFace**      | Uses PCA to project faces into a lower-dimensional “eigenface” space for comparison.                   | • Computationally efficient<br>• Works best on well-aligned, consistent images | • Sensitive to shadows, expressions, and variations<br>• Less robust overall |
| **Neural Network** | Uses a CNN encoder trained with triplet loss to learn embeddings where similar faces cluster together. | • High accuracy<br>• More robust to pose, lighting, and expression changes     | • Requires substantial training data<br>• Higher computational cost          |

### Recognition Thresholds

For recognizers that generate embedding vectors (such as **EigenFace** and **Neural Network** models), similarity is computed using **Cosine Similarity**, which ranges from **–1 to 1**
In practice, thresholds are chosen to decide whether two embeddings belong to the same person. 

Recommended threshold: **0.80**
| Cosine Similarity | Interpretation                             |
| ----------------- | ------------------------------------------ |
| **0.80 – 1.00**   | Very likely the same person                |
| **0.50 – 0.79**   | Possibly the same person — borderline zone |
| **< 0.50**        | Likely different people                    |

### Things to take note

#### Recognition Threshoolds
- Different models produce embeddings with different distributions, so thresholds should be **validated per deployment** instead of relying on a universal value.
- Lighting, pose, occlusions, and camera quality can influence similarity scores.
- Histogram-based recognition does **not** use vectors, so these thresholds do not apply.

#### Vector Caching
Histogram-based recognizers do not generate embedding vectors, so nothing can be cached in the database.
Because of this:
- Each time a new frame is sent for recognition, the system must recompute histograms for every dataset image.
- This leads to significantly slower recognition speeds, especially as the dataset grows.
- Embedding-based systems (Eigenface, Neural Net) avoid this issue because their vectors can be precomputed and cached.

#### Model Compatibility
Haar Cascade and LBP Cascade detectors are generally less accurate than modern deep-learning detectors like YOLO. As a result, we chose not to train more complex recognizers (EigenFace or Neural Network) on their outputs.
Detection errors from these less reliable detectors would propagate into the recognizer, reducing overall recognition accuracy.
|                           | YOLO | Haar Cascade | LBP Cascade | 
| ------------------------- | ---- | ------------ | ----------- |
| **Histogram**             | ✅   | ✅           | ✅         |
| **Eigenface**             | ✅    | ❌          | ❌         |
| **Neural Net**            | ✅    | ❌          | ❌         |

---

## 10. Common Errors

### Error: `JAVA_HOME` not set
**Cause:** Java JDK not properly installed or environment variable not configured.  
**Fix:** 
```bash
# Windows
setx JAVA_HOME "C:\Program Files\Java\jdk-<version>"

# macOS/Linux
export JAVA_HOME=/path/to/jdk
```

### Error: `mvn: command not found`
**Cause:** Maven not installed or not in PATH.  
**Fix:** Verify Maven installation and add to PATH (see [Adding Maven to PATH](#adding-maven-to-path)), then restart terminal.

### Error: `npm: command not found`
**Cause:** Node.js/npm not installed or not in PATH.  
**Fix:** Install Node.js from official website or use a package manager.

### Error: Port already in use
**Cause:** Another application is using the required port.  
**Fix:** 
- Kill the process using the port
- Change the port in application configuration

### Error: Cannot connect to backend
**Cause:** Backend not running or incorrect URL in `.env` file.  
**Fix:** 
- Ensure backend is running
- Verify `VITE_API_URL` in `.env` matches backend URL

### Error: `Module not found` in frontend
**Cause:** Dependencies not installed properly.  
**Fix:** 
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 11. Appendix

* **Presentation Slides:** [Canva Slides](https://www.canva.com/design/DAG4HoE3phw/M5kY-IdeFoksTVHt4eF23A/edit?utm_content=DAG4HoE3phw&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
* **Database Diagram:** [DB Diagram](https://dbdiagram.io/d/6918f8376735e11170fcd4048f8376735e11170fcd404)
* **UML Diagram (Entities):** [Lucidchart Diagram](https://lucid.app/lucidchart/be99d782-36b2-464f-a9ef-f22bfc7a52df/edit?viewport_loc=-2204%2C-845%2C4989%2C2364%2CHWEp-vi-RSFO&invitationId=inv_be795449-8455-4551-a2c8-a032378f650b)
* **UML Diagram (Facial Recognition):** [Lucidchart Diagram](https://lucid.app/lucidchart/037d1ba1-5f9e-45dc-bdcd-cecc3859f2aa/edit?viewport_loc=-2136%2C-738%2C4452%2C2010%2C0_0&invitationId=inv_850e6e1c-1f8b-4b42-b11f-44dcda81eb76)
---
