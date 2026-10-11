/**
 * Input Validation Middleware for Task 5 User REST API
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates payload for POST /users (Create User)
 */
export const validateCreateUser = (req, res, next) => {
  const { name, email, age } = req.body;
  const errors = [];

  // 1. Validate Name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Field "name" is required and must be a non-empty string.');
  } else if (name.trim().length < 2) {
    errors.push('Field "name" must be at least 2 characters long.');
  }

  // 2. Validate Email
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('Field "email" is required.');
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push('Field "email" must be a valid email address (e.g. user@example.com).');
  }

  // 3. Validate Age
  if (age === undefined || age === null) {
    errors.push('Field "age" is required.');
  } else if (typeof age !== 'number' || !Number.isInteger(age)) {
    errors.push('Field "age" must be an integer number.');
  } else if (age <= 0 || age > 120) {
    errors.push('Field "age" must be a realistic positive number between 1 and 120.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validates payload for PUT /users/:id (Update User)
 */
export const validateUpdateUser = (req, res, next) => {
  const { name, email, age } = req.body;
  const errors = [];

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Request body cannot be empty.'
    });
  }

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      errors.push('Field "name" must be a non-empty string.');
    } else if (name.trim().length < 2) {
      errors.push('Field "name" must be at least 2 characters long.');
    }
  }

  if (email !== undefined) {
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      errors.push('Field "email" must be a valid email address.');
    }
  }

  if (age !== undefined) {
    if (typeof age !== 'number' || !Number.isInteger(age)) {
      errors.push('Field "age" must be an integer number.');
    } else if (age <= 0 || age > 120) {
      errors.push('Field "age" must be a realistic positive number between 1 and 120.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};
