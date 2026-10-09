# Workshop Registration Service

Full Stack Developer Technical Assessment — Kenora (Pvt) Ltd

## Project Overview

A workshop registration management system designed for a community training centre operating across three locations.

The application supports role-based staff access, workshop management, attendee registration, cancellation history and workshop capacity control.

## Technology Stack

**Frontend**
- Next.js
- CSS

**Backend**
- Node.js
- Express.js
- JWT Authentication
- bcryptjs

**Database**
- MongoDB Atlas
- Mongoose

## Project Structure

- `frontend/` — Next.js application
- `backend/` — Express REST API
- `TECHNICAL_DECISIONS.md` — Architecture and design decisions

## Prerequisites

- Node.js and npm
- MongoDB Atlas database
- Git


Backend URL: `http://localhost:5000`

Frontend URL: `http://localhost:3000`

## Development Admin Login

- Email: `admin@workshop.local`
- Password: The `Admin@123` value configured in the local backend `.env` file.

Run `npm run seed:admin` before logging in.

The system does not provide public signup. Administrators create Manager and Staff accounts.

## User Roles

 Admin --> Create accounts and assign roles 
 Manager --> Create/edit workshops, register/cancel attendees, view history
 Staff --> View workshops, register/cancel attendees, view history

Permissions are enforced by backend middleware.

## Core Features

- JWT-based authentication
- Role-based access control
- Workshop creation and editing
- Attendee registration
- Capacity enforcement
- Cancellation without deleting registration history
- Filtering workshops by status, date and available seats

## API Overview

- `POST /api/auth/login`
- `POST /api/users`
- `GET /api/users`
- `GET /api/workshops`
- `POST /api/workshops`
- `PUT /api/workshops/:id`
- `POST /api/workshops/:id/register`
- `GET /api/workshops/:id/registrations`
- `PATCH /api/registrations/:id/cancel`

Protected endpoints require a JWT Bearer token.

## Sample Data

Sample workshops should be created for evaluation:

- WS001 — Pottery Basics

Sample Logins

- Manager --> banitha@workshop.local -- Banitha@123
- Staff --> staff@workshop.local -- Staff@123

# How to run

Backend

- cd backend
- npm install
- npm run dev

Frontend

- cd frontend
- npm install
- npm run dev

