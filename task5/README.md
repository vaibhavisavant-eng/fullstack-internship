# 🗄️ Task 5 — Express REST API with MySQL Database Integration

An enterprise-ready RESTful API for **User Management** built with **Node.js**, **Express.js**, and **MySQL** (`mysql2/promise`). Features connection pooling, environment variables via `dotenv`, parameterized SQL queries to prevent SQL Injection, database constraint error handling (`409 Conflict`), and input validation.

---

## 📁 Project Architecture

```
task5/
├── .env                           # Environment variables (DB credentials & Port)
├── .env.example                   # Environment configuration template
├── .gitignore                     # Git exclusion rules
├── package.json                   # Dependencies (express, mysql2, dotenv, cors, nodemon)
├── schema.sql                     # SQL script to create database, table & seed data
├── task5.postman_collection.json  # Postman collection v2.1.0 for testing
├── README.md                      # Comprehensive setup & API documentation
└── src/
    ├── server.js                  # Entry point, Express app listener & DB status check
    ├── config/
    │   └── db.js                  # MySQL2 connection pool setup
    ├── controllers/
    │   └── userController.js      # Parameterized SQL CRUD handler functions
    ├── middleware/
    │   ├── validation.js          # Input validation for POST and PUT
    │   └── errorHandler.js        # 404 & Global DB Error Handler (ER_DUP_ENTRY -> 409)
    └── routes/
        └── userRoutes.js          # User endpoint routing
```

---

## 🗄️ Step 1: Database Setup Instructions

### Option A: Using MySQL Command Line (CLI)
1. Ensure MySQL Server is running locally on port `3306`.
2. Open terminal and run the schema initialization script:
   ```bash
   mysql -u root -p < schema.sql
   ```
   *(Enter your MySQL root password when prompted)*

### Option B: Using MySQL Workbench / phpMyAdmin / DBeaver
1. Open MySQL Workbench or your preferred SQL client.
2. Connect to your local MySQL instance.
3. Open [`schema.sql`](file:///c:/Users/vaibhavi/OneDrive/Desktop/vai2028/Internship/task5/schema.sql) and execute the full script.

This will automatically create the `user_db` database, the `users` table with auto-increment primary key and `email UNIQUE` constraint, and populate 4 sample records.

---

## ⚙️ Step 2: Environment Variables Setup

1. Copy `.env.example` to `.env` (already provided in the repository):
   ```bash
   cp .env.example .env
   ```
2. Update the credentials in `.env` to match your local MySQL configuration:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=user_db
   DB_CONNECTION_LIMIT=10
   ```

---

## 🚀 Step 3: Run the API Server

### 1. Install Dependencies
```bash
cd task5
npm install
```

### 2. Start in Development Mode (Hot Reload with `nodemon`)
```bash
npm run dev
```

### 3. Start in Production Mode
```bash
npm start
```

The server will launch at **`http://localhost:5000`** and test connection to MySQL on startup.

---

## 📑 API Endpoint Specifications

Base URL: `http://localhost:5000`

---

### 1. `GET /users` — Retrieve All Users
Fetches all user records from the MySQL database ordered by newest first. Supports optional search filtering.

- **Method**: `GET`
- **URL**: `http://localhost:5000/users`
- **Query Params**: `?search=alice` (Optional)
- **Status**: `200 OK`
- **Response**:
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": 4,
      "name": "Diana Prince",
      "email": "diana@example.com",
      "age": 30,
      "created_at": "2026-10-10T10:00:00.000Z"
    },
    {
      "id": 3,
      "name": "Charlie Davis",
      "email": "charlie@example.com",
      "age": 22,
      "created_at": "2026-10-10T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Bob Smith",
      "email": "bob@example.com",
      "age": 34,
      "created_at": "2026-10-10T10:00:00.000Z"
    },
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "age": 28,
      "created_at": "2026-10-10T10:00:00.000Z"
    }
  ]
}
```

---

### 2. `GET /users/:id` — Retrieve User by ID
Fetches a single user record from MySQL by `id`.

- **Method**: `GET`
- **URL**: `http://localhost:5000/users/1`
- **Status**: `200 OK` (Found) / `404 Not Found` (Not Found)

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "age": 28,
    "created_at": "2026-10-10T10:00:00.000Z"
  }
}
```

#### Not Found Response (`404 Not Found`):
```json
{
  "success": false,
  "message": "User with ID \"999\" not found."
}
```

---

### 3. `POST /users` — Create New User
Inserts a new user into MySQL using parameterized query.

- **Method**: `POST`
- **URL**: `http://localhost:5000/users`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Edward Norton",
  "email": "edward@example.com",
  "age": 35
}
```

#### Success Response (`201 Created`):
```json
{
  "success": true,
  "message": "User created successfully.",
  "data": {
    "id": 5,
    "name": "Edward Norton",
    "email": "edward@example.com",
    "age": 35,
    "created_at": "2026-10-10T10:05:00.000Z"
  }
}
```

#### Validation Error (`400 Bad Request`):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Field \"name\" is required and must be a non-empty string.",
    "Field \"email\" must be a valid email address (e.g. user@example.com)."
  ]
}
```

#### Duplicate Email Conflict (`409 Conflict`):
```json
{
  "success": false,
  "message": "A user with email \"alice@example.com\" already exists."
}
```

---

### 4. `PUT /users/:id` — Update User
Updates an existing user record in MySQL.

- **Method**: `PUT`
- **URL**: `http://localhost:5000/users/1`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Alice Johnson Updated",
  "email": "alice.updated@example.com",
  "age": 29
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "User updated successfully.",
  "data": {
    "id": 1,
    "name": "Alice Johnson Updated",
    "email": "alice.updated@example.com",
    "age": 29,
    "created_at": "2026-10-10T10:00:00.000Z"
  }
}
```

---

### 5. `DELETE /users/:id` — Delete User
Removes a user record from MySQL by `id`.

- **Method**: `DELETE`
- **URL**: `http://localhost:5000/users/3`
- **Status**: `200 OK`

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "User with ID \"3\" deleted successfully.",
  "data": {
    "id": 3,
    "name": "Charlie Davis",
    "email": "charlie@example.com",
    "age": 22,
    "created_at": "2026-10-10T10:00:00.000Z"
  }
}
```

---

## 🛡️ Security & Performance Features

1. **SQL Injection Prevention**:
   All database queries use parameterized placeholders (`?`) provided by `mysql2/promise`. Input values are safely bound and escaped by the driver, neutralizing SQL injection vectors.
   ```javascript
   // Safe Parameterized Query
   const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [userEmail]);
   ```

2. **Connection Pooling**:
   Uses `mysql2.createPool()` to reuse database connections, minimizing connection overhead and boosting concurrent request throughput.

3. **Database Constraint Error Handling**:
   Catches MySQL error `ER_DUP_ENTRY` (Code 1062) for `UNIQUE` email constraint violations and gracefully maps it to HTTP `409 Conflict`.

---

## 🧪 Postman Collection Testing

1. Open **Postman**.
2. Click **Import** and choose [`task5.postman_collection.json`](file:///c:/Users/vaibhavi/OneDrive/Desktop/vai2028/Internship/task5/task5.postman_collection.json).
3. Run the requests to verify endpoint responses and DB constraints.
