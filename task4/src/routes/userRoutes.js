import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import {
  validateCreateUser,
  validateUpdateUser
} from '../middleware/validation.js';

const router = express.Router();

// GET /users - Retrieve all users
router.get('/', getAllUsers);

// GET /users/:id - Retrieve single user by ID
router.get('/:id', getUserById);

// POST /users - Create new user (with validation)
router.post('/', validateCreateUser, createUser);

// PUT /users/:id - Update user by ID (with validation)
router.put('/:id', validateUpdateUser, updateUser);

// DELETE /users/:id - Delete user by ID
router.delete('/:id', deleteUser);

export default router;
