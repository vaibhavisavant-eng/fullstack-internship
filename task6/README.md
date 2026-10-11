# 🛡️ Task 6 — Full Stack User Management System

A production-grade, full-stack User Management Application built with **Node.js**, **Express.js**, **MySQL**, **React (Vite)**, and **JWT Authentication**.

---

## 📁 Project Architecture

```
task6/
├── schema.sql                     # Database creation & seed script
├── README.md                      # Comprehensive setup & run guide
├── backend/                       # Node.js + Express + MySQL REST API
│   ├── .env                       # Environment variables
│   ├── .env.example               # Environment template
│   ├── package.json               # Backend dependencies
│   └── src/
│       ├── server.js              # Express app entry point & status checker
│       ├── config/
│       │   └── db.js              # MySQL connection pool
│       ├── middleware/
│       │   ├── auth.js            # JWT verification middleware
│       │   ├── validation.js      # Input validation middleware
│       │   └── errorHandler.js    # 404 & duplicate entry error handling
│       ├── controllers/
│       │   ├── authController.js  # JWT Auth (register, login, me)
│       │   └── userController.js  # Parameterized SQL CRUD operations
│       └── routes/
│           ├── authRoutes.js      # /api/auth routes
│           └── userRoutes.js      # /api/users routes
└── frontend/                      # React 18 + Vite SPA
    ├── index.html                 # HTML5 document template
    ├── package.json               # Frontend dependencies
    ├── vite.config.js             # Vite development server configuration
    └── src/
        ├── main.jsx               # React DOM root renderer
        ├── App.jsx                # Main container & state manager
        ├── index.css              # Custom CSS design system (Dark glassmorphism)
        ├── services/
        │   └── api.js             # Fetch API service layer
        └── components/
            ├── Navbar.jsx         # Navigation bar & auth user badge
            ├── UserTable.jsx      # User directory table with search & role badges
            ├── UserModal.jsx      # Add / Edit user modal with validation
            ├── DeleteConfirmModal.jsx # Delete confirmation dialog
            ├── AuthModal.jsx      # Login / Registration tabbed modal
            └── Toast.jsx          # Notification toast feedback
```

---

## ⚡ Step-by-Step Setup & Run Guide

### Step 1: Database Setup
1. Ensure MySQL Server is running locally on port `3306`.
2. Execute [`schema.sql`](file:///c:/Users/vaibhavi/OneDrive/Desktop/vai2028/Internship/task6/schema.sql) in your MySQL client or CLI:
   ```bash
   mysql -u root -p < schema.sql
   ```
   *This creates `fullstack_user_db`, the `users` table, and inserts seed records.*

---

### Step 2: Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd task6/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify or update credentials in `.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=fullstack_user_db
   JWT_SECRET=supersecret_jwt_key_task6_2026
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run on **`http://localhost:5000`**.

---

### Step 3: Frontend Setup
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd task6/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open **`http://localhost:3000`** in your browser.

---

## ✨ Features & Capabilities

1. **Full CRUD Operations**:
   - **Create**: Add new user records with name, email, age, and role.
   - **Read**: Live user directory table with real-time search filtering.
   - **Update**: Edit existing user details inline in a modal.
   - **Delete**: Remove user records with safety confirmation dialog.

2. **Form Validation & Error Handling**:
   - Client-side real-time validation for required fields, email regex, and age integer bounds.
   - Server-side validation middleware.
   - Catches duplicate email errors (`ER_DUP_ENTRY`) and displays inline alerts (`409 Conflict`).

3. **Authentication Bonus**:
   - JWT-based authentication (`bcryptjs` password hashing).
   - Sign up / Sign in modals.
   - Persistent login state stored in `localStorage`.

4. **Modern Responsive Design**:
   - Dark glassmorphism aesthetic built with custom CSS variables, skeleton loading indicators, and toast feedback messages.
