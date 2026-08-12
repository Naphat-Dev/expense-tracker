# 💰 Expense Tracker (Ledger)

A full-stack expense tracker for managing personal income and expenses.

The application supports user authentication, transaction management, search and filtering, financial summaries, profile management, and responsive design. Each user's data is isolated and can only be accessed by the authenticated user.

## 🌐 Live Demo

🔗 **[View Live Demo](https://my-expensetrack.vercel.app)**

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes

### 💰 Transaction Management
- Create income and expense transactions
- Add amount, date, category, and notes
- Edit transactions inline
- Delete transactions
- Delete all transactions

### 📊 Financial Summary
- Total income
- Total expenses
- Current balance
- Summary based on the user's transactions

### 🔎 Search & Filtering
- Search by note or category
- Filter by income / expense
- Filter by category
- Filter by time range
- Sort by date or amount

### 👤 Profile Management
- Update username
- Change password

### 📱 Responsive Design
- Responsive layout for desktop and mobile devices

---

## 🛠️ Tech Stack

### 🎨 Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Icons

### ⚙️ Backend

![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8-880000?logo=mongoose&logoColor=white)

- Node.js
- Express
- TypeScript
- Mongoose

### 🗄️ Database

![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)

- MongoDB
- MongoDB Atlas

### 🔑 Authentication

- JSON Web Token (JWT)
- bcrypt

---

## 🏗️ Architecture

```text
┌─────────────────────────┐
│        Frontend         │
│   React + TypeScript    │
│        Vite             │
└────────────┬────────────┘
             │
             │ REST API + JWT
             ▼
┌─────────────────────────┐
│         Backend         │
│   Node.js + Express     │
│      TypeScript         │
└────────────┬────────────┘
             │
             │ Mongoose
             ▼
┌─────────────────────────┐
│        MongoDB          │
│   User / Expense Data   │
└─────────────────────────┘
📁 Project Structure
expense-tracker/
│
├── 📂 backend/
│   └── 📂 src/
│       ├── 📂 config/
│       ├── 📂 controllers/
│       ├── 📂 middleware/
│       ├── 📂 models/
│       ├── 📂 routes/
│       └── 📄 server.ts
│
└── 📂 frontend/
    └── 📂 src/
        ├── 📂 api/
        ├── 📂 components/
        ├── 📂 pages/
        ├── 📂 types/
        └── 📄 App.tsx
🚀 Getting Started
📋 Prerequisites
Node.js 18+
npm
MongoDB or MongoDB Atlas
1️⃣ Clone the Repository
git clone https://github.com/<username>/expense-tracker.git
cd expense-tracker
2️⃣ Backend Setup
cd backend
npm install

Create a .env file:

PORT=3000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key

Start the development server:

npm run dev

Backend:

http://localhost:3000
3️⃣ Frontend Setup

Open another terminal:

cd frontend
npm install

Create .env.development if needed:

VITE_API_URL=http://localhost:3000

Start the development server:

npm run dev

Frontend:

http://localhost:5173
🔌 API Overview

The backend provides RESTful APIs for:

🔐 Authentication
💰 Expense CRUD operations
🔎 Search and filtering
📊 Financial summaries
👤 User profile management
🔑 Password management

Protected endpoints require a JWT:

Authorization: Bearer <token>

Example:

GET /api/expenses/filter?type=expense&category=food&timeRange=thismonth&sort=amount-desc
🌍 Deployment
Service	Platform
🎨 Frontend	Vercel
⚙️ Backend	Render
🗄️ Database	MongoDB Atlas
📚 What I Learned

Through this project, I practiced:

⚛️ Building a full-stack application with React and Node.js
🔌 Designing RESTful APIs with Express
🗄️ Working with MongoDB and Mongoose
🔐 Implementing JWT authentication
🔑 Password hashing with bcrypt
🛡️ Building protected routes and user-specific data access
✏️ Implementing CRUD operations
🔎 Implementing search, filtering, and sorting
🔗 Connecting frontend and backend services
🚀 Deploying a full-stack application
🔒 Security
Passwords are hashed using bcrypt
Authentication is handled using JWT
Protected API routes require a valid token
Expense data is associated with the authenticated user's userId
Users can only access and modify their own transactions
Sensitive configuration is stored in environment variables

⚠️ Never commit .env files or expose secret keys in the repository.
