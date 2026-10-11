# 🚀 Task 4 — Node.js & Express User REST API

A clean, modular RESTful API for **User Management** built with **Node.js**, **Express.js**, and in-memory array storage. Includes input validation middleware, central error handling, HTTP status codes, and a ready-to-import Postman collection.

---

## 📁 Project Structure

```
task4/
├── package.json                   # Dependencies and scripts (express, cors, nodemon)
├── README.md                      # API documentation and endpoint specs
├── task4.postman_collection.json  # Postman collection for manual testing
└── src/
    ├── server.js                  # Express app initialization & server listener
    ├── controllers/
    │   └── userController.js      # CRUD handler functions & in-memory database
    ├── middleware/
    │   ├── validation.js          # Input validation for POST and PUT requests
    │   └── errorHandler.js        # 404 and global error handling middleware
    └── routes/
        └── userRoutes.js          # REST API endpoints routing
```

---

## ⚡ Quick Setup & Running Instructions

### 1. Navigate to the task folder
```bash
cd task4
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start in Development mode (with `nodemon` hot reloading)
```bash
npm run dev
```

### 4. Start in Production mode
```bash
npm start
```

The server will launch at: **`http://localhost:5000`**

---

## 📑 API Endpoint Documentation

Base URL: `http://localhost:5000`

---

### 1. `GET /users` — Get All Users
Retrieves the list of all registered users. Supports optional search filter by name or email.

- **Method**: `GET`
- **URL**: `http://localhost:5000/users`
- **Query Parameters (Optional)**: `?search=alice`
- **Response Status**: `200 OK`
- **Example Response Body**:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "1",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "age": 28
    },
    {
      "id": "2",
      "name": "Bob Smith",
      "email": "bob@example.com",
      "age": 34
    },
    {
      "id": "3",
      "name": "Charlie Davis",
      "email": "charlie@example.com",
      "age": 22
    }
  ]
}
```

---

### 2. `GET /users/:id` — Get User by ID
Retrieves details of a single user by their unique ID.

- **Method**: `GET`
- **URL**: `http://localhost:5000/users/1`
- **Response Status**: `200 OK` (If found) / `404 Not Found` (If not found)

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "age": 28
  }
}
```

#### Error Response (`404 Not Found`):
```json
{
  "success": false,
  "message": "User with ID \"999\" not found."
}
```

---

### 3. `POST /users` — Create New User
Creates a new user record. Validates that `name`, `email`, and `age` are provided and correctly formatted.

- **Method**: `POST`
- **URL**: `http://localhost:5000/users`
- **Headers**: `Content-Type: application/json`
- **Request Body Example**:
```json
{
  "name": "David Miller",
  "email": "david.miller@example.com",
  "age": 29
}
```

#### Success Response (`201 Created`):
```json
{
  "success": true,
  "message": "User created successfully.",
  "data": {
    "id": "4",
    "name": "David Miller",
    "email": "david.miller@example.com",
    "age": 29
  }
}
```

#### Validation Error Response (`400 Bad Request`):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Field \"name\" is required and must be a non-empty string.",
    "Field \"email\" must be a valid email address (e.g. user@example.com).",
    "Field \"age\" must be a realistic positive number between 1 and 120."
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
Updates an existing user record by ID.

- **Method**: `PUT`
- **URL**: `http://localhost:5000/users/1`
- **Headers**: `Content-Type: application/json`
- **Request Body Example**:
```json
{
  "name": "Alice Johnson-Updated",
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
    "id": "1",
    "name": "Alice Johnson-Updated",
    "email": "alice.updated@example.com",
    "age": 29
  }
}
```

---

### 5. `DELETE /users/:id` — Delete User
Deletes a user record by ID.

- **Method**: `DELETE`
- **URL**: `http://localhost:5000/users/2`
- **Response Status**: `200 OK`

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "User with ID \"2\" has been deleted successfully.",
  "data": {
    "id": "2",
    "name": "Bob Smith",
    "email": "bob@example.com",
    "age": 34
  }
}
```

---

## 🧪 Testing with Postman

1. Open **Postman**.
2. Click **Import** in the top-left corner.
3. Select the file [`task4.postman_collection.json`](file:///c:/Users/vaibhavi/OneDrive/Desktop/vai2028/Internship/task4/task4.postman_collection.json).
4. Run the pre-configured requests to test each endpoint and validation rule.

---

## 🛠️ Summary of Node & Express Concepts Used

- **Express Middleware**: `express.json()` for request body parsing, `cors()` for cross-origin resource sharing.
- **Modular Architecture**: Clean separation of routes (`userRoutes.js`), controllers (`userController.js`), and middlewares (`validation.js`, `errorHandler.js`).
- **RESTful Conventions**: Semantic HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) and standard status codes (`200`, `201`, `400`, `404`, `409`, `500`).
- **In-Memory Storage**: Fast array operations (`find`, `findIndex`, `filter`, `splice`) simulating a database table.
