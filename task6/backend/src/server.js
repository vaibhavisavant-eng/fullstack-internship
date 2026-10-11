import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { testDbConnection } from './config/db.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend integration
app.use(cors());
app.use(express.json());

// API Status Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '⚡ Fullstack User Management System API is live!',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      users: {
        getAll: 'GET /api/users',
        getById: 'GET /api/users/:id',
        create: 'POST /api/users',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id'
      }
    }
  });
});

// Resource Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error Middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server
app.listen(PORT, async () => {
  console.log(`=================================================`);
  console.log(`🚀 Task 6 Backend Server running on port ${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}`);
  console.log(`=================================================`);
  await testDbConnection();
});

export default app;
