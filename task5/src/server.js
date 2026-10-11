import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import { testDbConnection } from './config/db.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base Status Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '⚡ MySQL Express User REST API is online!',
    database: process.env.DB_NAME || 'user_db',
    endpoints: {
      getAllUsers: 'GET /users',
      getUserById: 'GET /users/:id',
      createUser: 'POST /users',
      updateUser: 'PUT /users/:id',
      deleteUser: 'DELETE /users/:id'
    }
  });
});

// Resource Routes
app.use('/users', userRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server & Test Database Connection
app.listen(PORT, async () => {
  console.log(`=================================================`);
  console.log(`🚀 MySQL REST API Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`=================================================`);
  
  // Test connection to MySQL database
  await testDbConnection();
});

export default app;
