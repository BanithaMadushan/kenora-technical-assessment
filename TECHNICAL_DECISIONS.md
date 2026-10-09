# Technical Decisions

## 1. Technology Choices

I selected Next.js with React JSX and CSS for the frontend because it allows me to create reusable components and responsive pages.

I used Node.js and Express.js for the backend because they are simple and suitable for building REST APIs.

MongoDB Atlas is used to store users, workshops, and registrations.

## 2. System Design

The frontend and backend are developed separately.

The backend uses Models, Controllers, Routes, and Middleware to keep the code organized.

The system supports three roles: Admin, Manager, and Staff.

## 3. Security

JWT is used for user authentication.

Passwords are securely hashed using bcryptjs.

Only Admins can create user accounts. Backend middleware checks user permissions.

Public signup is not available.

## 4. Preventing Over-Registration

Each workshop has a maximum capacity.

The system uses a MongoDB atomic conditional update and transaction to prevent registrations from exceeding capacity, including when multiple requests are made at the same time.

When a registration is cancelled, the seat becomes available again.

Cancelled registrations are kept for history instead of being deleted.

## 5. Assumptions

Attendees do not need accounts. Staff enter attendee names and email addresses.

Only scheduled workshops accept new registrations.

## 6. Trade-offs

I selected a simple architecture to complete the main requirements within the three-hour time limit.

I prioritized functionality and security over advanced UI features.
