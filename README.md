# Expense Tracker

A full-stack web application for managing personal income and expenses.

Built with React, TypeScript, Node.js, Express, and MongoDB. The application provides JWT-based authentication, transaction management, search and filtering, financial summaries, and user-specific data access.

<p align="center">
  <a href="https://my-expensetrack.vercel.app">
    <img src="https://img.shields.io/badge/Expense%20Tracker-Live%20Demo-000000?style=for-the-badge" alt="Expense Tracker">
  </a>
  <a href="https://portfolio-web-mu-woad.vercel.app">
    <img src="https://img.shields.io/badge/Portfolio-Live%20Demo-000000?style=for-the-badge" alt="Portfolio">
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

## Authentication & Security

- Passwords are hashed using `bcrypt`
- JWT is used for authentication
- Protected routes require a valid token
- User data is associated with `userId`
- Users can only access their own transactions
- Sensitive configuration is stored in environment variables

---

## API Overview

The backend provides RESTful APIs for:

| Resource | Operations |
|---|---|
| Authentication | Register, Login |
| Expenses | Create, Read, Update, Delete |
| Filtering | Search, Filter, Sort |
| Summary | Income, Expenses, Balance |
| Profile | View and Update Profile |
| Password | Change Password |


## Live Demo
<p align="center"> <a href="https://my-expensetrack.vercel.app"> <img src="https://img.shields.io/badge/🚀%20Open%20Expense%20Tracker-000000?style=for-the-badge" alt="Open Expense Tracker"> </a> </p>
<p align="center"> Built with React, TypeScript, Node.js, Express, and MongoDB. </p> 

