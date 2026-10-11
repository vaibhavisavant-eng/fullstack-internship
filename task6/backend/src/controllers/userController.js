import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    let sql = 'SELECT id, name, email, age, role, created_at FROM users';
    const params = [];

    if (search) {
      sql += ' WHERE name LIKE ? OR email LIKE ?';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    sql += ' ORDER BY id DESC';

    const [rows] = await pool.query(sql, params);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT id, name, email, age, role, created_at FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `User with ID "${id}" not found.`
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

export const createUser = async (req, res, next) => {
  try {
    const { name, email, age, password, role } = req.body;
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanAge = Number(age);
    const userRole = role || 'User';

    // Duplicate check
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: `A user with email "${cleanEmail}" already exists.`
      });
    }

    // Default password hash if not passed
    const passToHash = password || 'Password123!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passToHash, salt);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, age, password, role) VALUES (?, ?, ?, ?, ?)',
      [cleanName, cleanEmail, cleanAge, hashedPassword, userRole]
    );

    const [createdRows] = await pool.query(
      'SELECT id, name, email, age, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: createdRows[0]
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, age, role } = req.body;

    const [existing] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `User with ID "${id}" not found.`
      });
    }

    const current = existing[0];
    const newName = name !== undefined ? name.trim() : current.name;
    const newEmail = email !== undefined ? email.trim().toLowerCase() : current.email;
    const newAge = age !== undefined ? Number(age) : current.age;
    const newRole = role !== undefined ? role : current.role;

    if (email && newEmail !== current.email) {
      const [conflict] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [newEmail, id]);
      if (conflict.length > 0) {
        return res.status(409).json({
          success: false,
          message: `Email "${newEmail}" is already in use.`
        });
      }
    }

    await pool.query(
      'UPDATE users SET name = ?, email = ?, age = ?, role = ? WHERE id = ?',
      [newName, newEmail, newAge, newRole, id]
    );

    const [updatedRows] = await pool.query(
      'SELECT id, name, email, age, role, created_at FROM users WHERE id = ?',
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: updatedRows[0]
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id, name, email, age, role, created_at FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `User with ID "${id}" not found.`
      });
    }

    const deletedUser = existing[0];
    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: `User with ID "${id}" deleted successfully.`,
      data: deletedUser
    });
  } catch (error) {
    next(error);
  }
};
