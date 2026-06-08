# AI Personalized Learning System

## Project Overview

The AI Personalized Learning System is an intelligent educational platform designed to provide customized learning experiences for students. The system analyzes student performance and learning behavior to recommend suitable study materials, quizzes, and learning paths. This helps students learn at their own pace and improve their academic performance.

---

## Problem Statement

Traditional learning systems provide the same content and teaching methods to all students regardless of their learning abilities, interests, and pace. This approach may not effectively support every student. Therefore, there is a need for an intelligent system that can personalize learning content and recommendations based on individual student performance.

---

## Objectives

* Provide personalized learning experiences for students.
* Analyze student performance and learning progress.
* Recommend suitable learning materials based on student needs.
* Improve learning efficiency and engagement.
* Support self-paced learning.
* Track and monitor student progress effectively.

---

## Scope of the Project

* Student registration and login.
* Learning material management.
* Online quizzes and assessments.
* Performance tracking and analysis.
* Personalized learning recommendations.
* Progress report generation.

---

## Module List

### 1. User Authentication Module

* Student Registration
* Login and Logout
* Profile Management

### 2. Student Management Module

* Manage Student Information
* Update Student Records
* View Student Details

### 3. Learning Material Module

* Upload Learning Materials
* Access Study Resources
* Course-wise Material Organization

### 4. Quiz and Assessment Module

* Conduct Online Quizzes
* Evaluate Student Performance
* Store Quiz Results

### 5. Progress Tracking Module

* Monitor Learning Progress
* Display Completion Percentage
* Generate Progress Reports

### 6. Recommendation Module

* Analyze Quiz Performance
* Recommend Learning Materials
* Provide Personalized Suggestions

### 7. Report Generation Module

* Generate Student Reports
* Display Performance Statistics
* Export Progress Reports

---

## Technology Stack

### Front End

* HTML
* CSS
* JavaScript
* Bootstrap

### Back End

* Python
* Flask

### Database

* SQLite / MySQL

---

## Database Table List

### Students

| Field Name | Type         |
| ---------- | ------------ |
| student_id | INT (PK)     |
| name       | VARCHAR(100) |
| email      | VARCHAR(100) |
| password   | VARCHAR(100) |
| department | VARCHAR(50)  |

### Courses

| Field Name  | Type         |
| ----------- | ------------ |
| course_id   | INT (PK)     |
| course_name | VARCHAR(100) |
| description | TEXT         |

### Learning_Materials

| Field Name   | Type         |
| ------------ | ------------ |
| material_id  | INT (PK)     |
| course_id    | INT (FK)     |
| title        | VARCHAR(100) |
| content_link | VARCHAR(255) |

### Quizzes

| Field Name  | Type         |
| ----------- | ------------ |
| quiz_id     | INT (PK)     |
| course_id   | INT (FK)     |
| quiz_name   | VARCHAR(100) |
| total_marks | INT          |

### Quiz_Results

| Field Name   | Type     |
| ------------ | -------- |
| result_id    | INT (PK) |
| student_id   | INT (FK) |
| quiz_id      | INT (FK) |
| score        | INT      |
| attempt_date | DATE     |

### Recommendations

| Field Name           | Type         |
| -------------------- | ------------ |
| recommendation_id    | INT (PK)     |
| student_id           | INT (FK)     |
| recommended_material | VARCHAR(255) |
| recommendation_date  | DATE         |

### Progress

| Field Name            | Type     |
| --------------------- | -------- |
| progress_id           | INT (PK) |
| student_id            | INT (FK) |
| course_id             | INT (FK) |
| completion_percentage | FLOAT    |
| last_updated          | DATE     |

---

## Expected Outcome

The system will provide personalized learning recommendations based on student performance and learning behavior. It will help students improve their understanding, increase engagement, and achieve better academic results.

---

## Future Enhancements

* AI-powered chatbot for doubt clarification.
* Voice-based learning assistant.
* Mobile application support.
* Advanced machine learning algorithms.
* Real-time analytics dashboard.
* Multi-language learning support.

---

## Author

**Dhanuja**
First Year Student Project
