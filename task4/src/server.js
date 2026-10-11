import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Status Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 User Management REST API is live!',
    endpoints: {
      getAllUsers: 'GET /users',
      getUserById: 'GET /users/:id',
      createUser: 'POST /users',
      updateUser: 'PUT /users/:id',
      deleteUser: 'DELETE /users/:id'
    }
  });
});

// User Entity Resource Routes
app.use('/users', userRoutes);

// 404 & Global Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`⚡ REST API Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`👥 Users Endpoint: http://localhost:${PORT}/users`);
  console.log(`===========================================`);
});

export default app;
