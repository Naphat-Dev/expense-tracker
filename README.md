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
