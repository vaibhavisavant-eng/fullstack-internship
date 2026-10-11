import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_task6_2026';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, age } = req.body;

    if (!name || !email || !password || age === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and age are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate email
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: `User with email "${cleanEmail}" already exists.`
      });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, age, password, role) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), cleanEmail, Number(age), hashedPassword, 'User']
    );

    const newUser = {
      id: result.insertId,
      name: name.trim(),
      email: cleanEmail,
      age: Number(age),
      role: 'User'
    };

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      data: newUser
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Fetch user with password
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const user = rows[0];

    // Verify password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      role: user.role
    };

    const token = generateToken(userPayload);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      data: userPayload
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, age, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
};
