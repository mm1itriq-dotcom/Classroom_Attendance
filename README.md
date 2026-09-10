# Classroom Attendance & Behavior Monitor

A modern, real-time application for tracking student attendance, check-ins, and generating automated attendance alerts based on behavior rules.

## Features
- **Student Management:** Register and manage student profiles (First Name, Last Name, Student ID).
- **Check-In Tracking:** Monitor when and where students check in, including badge status and room locations.
- **Rule-Based Alerts:** Automatically generate risk scores and alerts for students based on their attendance patterns.
- **Real-Time Streaming:** Built-in endpoints to stream real-time attendance events to the dashboard.

## Tech Stack
- **Backend:** Python, FastAPI, SQLAlchemy Core
- **Database:** PostgreSQL (with UUIDs)
- **Frontend:** React, Vite (located in the `frontend/` directory)

## Getting Started

### 1. Backend Setup (FastAPI)
Navigate to the root directory and install the required Python dependencies:
```bash
pip install -r requirements.txt
```

Ensure your database connection string in `app/database.py` is configured properly.

Run the FastAPI server:
```bash
uvicorn app.main:app --reload
```
The backend API will run on `http://127.0.0.1:8000`.

### 2. Frontend Setup (React/Vite)
Open a new terminal and navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
This will start the development server for the React dashboard.

## Database Schema
- **`students`**: Stores basic student information.
- **`check_ins`**: Logs every time a student badges into a room.
- **`attendance_alerts`**: Tracks automatically generated alerts and risk scores for students who break attendance rules.
