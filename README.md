# Healthcare Booking Platform

A full-stack web application designed for patients to find doctors and book appointments, and for doctors to manage their schedules.

## Features
- **Patient Portal**: Search for doctors, book appointments, view appointment history.
- **Doctor Portal**: Set availability, view and manage patient appointments, edit profile.
- **Modern UI**: Built with React, featuring a dark theme, glassmorphism, and responsive design.
- **Secure Backend**: Node.js and Express with JWT authentication and MongoDB.

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running locally on default port (27017)

### 1. Setup Backend
```bash
cd backend
npm install
npm run start # Or node server.js
```
The backend server will run on `http://localhost:5000`.

### 2. Setup Frontend
Open a new terminal.
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Technologies Used
- Frontend: React, Vite, React Router, Axios, Framer Motion, Tailwind CSS (via variables)
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, BcryptJS
