import pool from '../config/db.js';

/**
 * @route   GET /users
 * @desc    Get all users (supports optional search query)
 * @access  Public
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { search } = req.query;

    let sql = 'SELECT id, name, email, age, created_at FROM users';
    const params = [];

    if (search) {
      sql += ' WHERE name LIKE ? OR email LIKE ?';
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm);
    }

    sql += ' ORDER BY id DESC';

    // Parameterized SQL Query prevents SQL Injection
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

/**
 * @route   GET /users/:id
 * @desc    Get single user by ID
 * @access  Public
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Parameterized Query
    const [rows] = await pool.query(
      'SELECT id, name, email, age, created_at FROM users WHERE id = ?',
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

/**
 * @route   POST /users
 * @desc    Create a new user
 * @access  Public
 */
export const createUser = async (req, res, next) => {
  try {
    const { name, email, age } = req.body;
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanAge = Number(age);

    // 1. Check if email already exists using Parameterized Query
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [cleanEmail]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: `A user with email "${cleanEmail}" already exists.`
      });
    }

    // 2. Insert User using Parameterized Query
    const [result] = await pool.query(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      [cleanName, cleanEmail, cleanAge]
    );

    const insertedId = result.insertId;

    // 3. Fetch created record to return in response
    const [newRows] = await pool.query(
      'SELECT id, name, email, age, created_at FROM users WHERE id = ?',
      [insertedId]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: newRows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /users/:id
 * @desc    Update existing user by ID
 * @access  Public
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    // 1. Check if user exists
    const [existingUserRows] = await pool.query(
      'SELECT id, name, email, age FROM users WHERE id = ?',
      [id]
    );

    if (existingUserRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `User with ID "${id}" not found.`
      });
    }

    const currentUser = existingUserRows[0];
    const newName = name !== undefined ? name.trim() : currentUser.name;
    const newEmail = email !== undefined ? email.trim().toLowerCase() : currentUser.email;
    const newAge = age !== undefined ? Number(age) : currentUser.age;

    // 2. Check for email conflict if updating email
    if (email && newEmail !== currentUser.email) {
      const [emailConflict] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [newEmail, id]
      );

      if (emailConflict.length > 0) {
        return res.status(409).json({
          success: false,
          message: `Email "${newEmail}" is already in use by another user.`
        });
      }
    }

    // 3. Update User with Parameterized Query
    await pool.query(
      'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
      [newName, newEmail, newAge, id]
    );

    // 4. Fetch updated record
    const [updatedRows] = await pool.query(
      'SELECT id, name, email, age, created_at FROM users WHERE id = ?',
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

/**
 * @route   DELETE /users/:id
 * @desc    Delete user by ID
 * @access  Public
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Check if user exists
    const [existingRows] = await pool.query(
      'SELECT id, name, email, age, created_at FROM users WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `User with ID "${id}" not found.`
      });
    }

    const deletedUser = existingRows[0];

    // 2. Delete User using Parameterized Query
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
