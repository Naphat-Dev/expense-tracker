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

## Architecture

```text
                    ┌──────────────────────┐
                    │       Frontend       │
                    │                      │
                    │ React + TypeScript   │
                    │ Vite + Tailwind CSS  │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               │ JWT
                               ▼
                    ┌──────────────────────┐
                    │       Backend        │
                    │                      │
                    │ Node.js + Express    │
                    │     TypeScript       │
                    └──────────┬───────────┘
                               │
                               │ Mongoose
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    │                      │
                    │  Users / Expenses    │
                    └──────────────────────┘
Project Structure
expense-tracker/
│
├── backend/
│   └── src/
│       ├── config/
│       │   └── database configuration
│       │
│       ├── controllers/
│       │   ├── auth
│       │   ├── expense
│       │   └── profile
│       │
│       ├── middleware/
│       │   └── authentication
│       │
│       ├── models/
│       │   ├── User
│       │   └── Expense
│       │
│       ├── routes/
│       │   ├── auth
│       │   ├── expense
│       │   └── profile
│       │
│       └── server.ts
│
└── frontend/
    └── src/
        ├── api/
        │   └── API client and requests
        │
        ├── components/
        │   └── Reusable UI components
        │
        ├── pages/
        │   ├── Login
        │   ├── Register
        │   ├── Ledger
        │   └── Profile
        │
        ├── types/
        │   └── TypeScript types
        │
        └── App.tsx
