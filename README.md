
Expense Tracker (Ledger)

A full-stack expense tracker for managing personal income and expenses.

The application supports user authentication, transaction management, search and filtering, financial summaries, profile management, and responsive design. Each user's data is isolated and can only be accessed by the authenticated user.

Live Demo

Frontend: https://my-expensetrack.vercel.app

Features
🔐 Authentication
User registration and login
JWT-based authentication
Password hashing with bcrypt
Protected routes
💰 Transaction Management
Create income and expense transactions
Add amount, date, category, and notes
Edit transactions inline
Delete transactions
Delete all transactions
📊 Financial Summary
Total income
Total expenses
Current balance
🔎 Search & Filtering
Search by note or category
Filter by income / expense
Filter by category
Filter by time range
Sort by date or amount
👤 Profile Management
Update username
Change password
📱 Responsive Design
Optimized for desktop and mobile devices
Tech Stack
Frontend
React 19
TypeScript
Vite
Tailwind CSS
React Router
React Icons
Backend
Node.js
Express
TypeScript
Mongoose
Database
MongoDB
MongoDB Atlas
Authentication
JSON Web Token (JWT)
bcrypt
Project Structure
expense-tracker/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── server.ts
│
└── frontend/
    └── src/
        ├── api/
        ├── components/
        ├── pages/
        ├── types/
        └── App.tsx
Architecture
React + TypeScript
       │
       │ REST API
       │ JWT
       ▼
Node.js + Express
       │
       │ Mongoose
       ▼
    MongoDB
Getting Started
Prerequisites
Node.js 18+
npm
MongoDB or MongoDB Atlas
1. Clone the repository
git clone https://github.com/<username>/expense-tracker.git
cd expense-tracker
2. Backend
cd backend
npm install

Create a .env file in the backend directory:

PORT=3000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key

Run the backend:

npm run dev

The API will run at:

http://localhost:3000
3. Frontend

Open another terminal:

cd frontend
npm install

Create .env.development if needed:

VITE_API_URL=http://localhost:3000

Run the frontend:

npm run dev

The application will run at:

http://localhost:5173
Environment Variables
Backend
Variable	Description
PORT	Backend server port
MONGO_URI	MongoDB connection string
JWT_SECRET	Secret key for JWT
Frontend
Variable	Description
VITE_API_URL	Backend API base URL

Never commit .env files or expose secret keys in the repository.

API Overview

The backend provides RESTful APIs for:

Authentication
Expense CRUD operations
Expense filtering and searching
Financial summaries
User profile management
Password management

Protected endpoints require a JWT:

Authorization: Bearer <token>

Example:

GET /api/expenses/filter?type=expense&category=food&timeRange=thismonth&sort=amount-desc
Deployment
Frontend: Vercel
Backend: Render
Database: MongoDB Atlas
What I Learned

Through this project, I practiced:

Building full-stack applications with React and Node.js
Developing RESTful APIs with Express
Working with MongoDB and Mongoose
Implementing JWT authentication
Password hashing with bcrypt
Building protected routes and user-specific data access
Implementing CRUD operations
Implementing search, filtering, and sorting
Connecting frontend and backend services
Deploying a full-stack application
