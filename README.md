# Expense Tracker

A full-stack web application for managing personal income and expenses.

Built with React, TypeScript, Node.js, Express, and MongoDB. The application provides JWT-based authentication, transaction management, search and filtering, financial summaries, and user-specific data access.

<p align="center">
  <a href="https://my-expensetrack.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Application-000000?style=for-the-badge" alt="Live Demo">
  </a>
</p>

---

## Overview

Expense Tracker allows users to manage their personal finances through a simple and responsive interface.

Each user has an individual account and can manage only their own transactions.

### Key Features

| Feature | Description |
|---|---|
| Authentication | Register and login with JWT-based authentication |
| Transactions | Create, edit, and delete income and expense records |
| Financial Summary | View total income, expenses, and current balance |
| Search | Search transactions by note or category |
| Filtering | Filter by type, category, and time range |
| Sorting | Sort transactions by date or amount |
| Profile | Update username and change password |
| Data Isolation | Users can only access their own transactions |
| Responsive UI | Supports desktop and mobile devices |

---

## Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, React Router |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Deployment | Vercel, Render, MongoDB Atlas |

---
Security
Passwords are hashed using bcrypt
JWT is used for authentication
Protected routes require a valid token
User data is associated with userId
Users can only access their own transactions
Sensitive configuration is stored in environment variables
API Overview

The backend provides RESTful APIs for the following resources:

Resource	Operations
Authentication	Register, Login
Expenses	Create, Read, Update, Delete
Filtering	Search, Filter, Sort
Summary	Income, Expenses, Balance
Profile	View and Update Profile
Password	Change Password

Protected endpoints require:

Authorization: Bearer <token>
Example Request
GET /api/expenses/filter?type=expense&category=food&timeRange=thismonth&sort=amount-desc
Getting Started
Prerequisites

Make sure you have the following installed:

Node.js 18+
npm
MongoDB or MongoDB Atlas
1. Clone the Repository
git clone https://github.com/<username>/expense-tracker.git
cd expense-tracker
2. Backend Setup
cd backend
npm install

Create a .env file inside the backend directory:

PORT=3000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key

Start the development server:

npm run dev

Backend:

http://localhost:3000
3. Frontend Setup

Open a new terminal:

cd frontend
npm install

Create .env.development:

VITE_API_URL=http://localhost:3000

Start the development server:

npm run dev

Frontend:

http://localhost:5173
Environment Variables
Backend
Variable	Description	Example
PORT	Backend server port	3000
MONGO_URI	MongoDB connection string	mongodb://127.0.0.1:27017/expense-tracker
JWT_SECRET	Secret key used to sign JWTs	your-secret-key
Frontend
Variable	Description	Example
VITE_API_URL	Backend API base URL	http://localhost:3000

Important: Never commit .env files or expose secret keys in the repository.

Deployment
Application	Platform
Frontend	Vercel
Backend	Render
Database	MongoDB Atlas
Production Architecture
User
 │
 ▼
Vercel
Frontend
 │
 │ HTTPS / REST API
 ▼
Render
Backend
 │
 │ MongoDB Driver
 ▼
MongoDB Atlas
Database
Scripts
Backend
Command	Description
npm run dev	Start development server
npm run build	Build TypeScript project
npm start	Start production server
Frontend
Command	Description
npm run dev	Start Vite development server
npm run build	Build production application
npm run preview	Preview production build
npm run lint	Run ESLint
What I Learned

This project helped strengthen my practical understanding of full-stack development, including:

Building applications with React and TypeScript
Developing RESTful APIs with Node.js and Express
Designing MongoDB schemas with Mongoose
Implementing JWT authentication
Hashing passwords with bcrypt
Building protected routes and authorization
Implementing CRUD operations
Implementing search, filtering, and sorting
Managing frontend API communication
Connecting frontend and backend services
Deploying a full-stack application
Future Improvements
Add pagination for large transaction lists
Add charts and financial analytics
Add monthly and yearly reports
Improve validation and error handling
Add automated testing
Add refresh token authentication
Live Demo
<p align="center"> <a href="https://my-expensetrack.vercel.app"> <img src="https://img.shields.io/badge/🚀%20Open%20Expense%20Tracker-000000?style=for-the-badge" alt="Open Expense Tracker"> </a> </p>
<p align="center"> Built with React, TypeScript, Node.js, Express, and MongoDB. </p> ```

