/**
 * User Controller — Handles business logic for user CRUD operations
 * Uses in-memory storage.
 */

// Initial Seed Data
let users = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', age: 28 },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', age: 34 },
  { id: '3', name: 'Charlie Davis', email: 'charlie@example.com', age: 22 }
];

let nextId = 4;

/**
 * @route   GET /users
 * @desc    Get all users (supports optional search by name)
 * @access  Public
 */
export const getAllUsers = (req, res) => {
  const { search } = req.query;

  let result = [...users];

  if (search) {
    const query = search.toLowerCase();
    result = result.filter(u => 
      u.name.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query)
    );
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
};

/**
 * @route   GET /users/:id
 * @desc    Get single user by ID
 * @access  Public
 */
export const getUserById = (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User with ID "${id}" not found.`
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
};

/**
 * @route   POST /users
 * @desc    Create a new user
 * @access  Public
 */
export const createUser = (req, res) => {
  const { name, email, age } = req.body;

  // Check for duplicate email
  const existingUser = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: `A user with email "${email}" already exists.`
    });
  }

  const newUser = {
    id: (nextId++).toString(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    age: Number(age)
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully.',
    data: newUser
  });
};

/**
 * @route   PUT /users/:id
 * @desc    Update existing user by ID
 * @access  Public
 */
export const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `User with ID "${id}" not found.`
    });
  }

  // Check if updating email to one that already belongs to another user
  if (email) {
    const emailOwner = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.id !== id);
    if (emailOwner) {
      return res.status(409).json({
        success: false,
        message: `Email "${email}" is already in use by another user.`
      });
    }
  }

  // Apply updates
  const currentUser = users[userIndex];
  const updatedUser = {
    ...currentUser,
    name: name !== undefined ? name.trim() : currentUser.name,
    email: email !== undefined ? email.trim().toLowerCase() : currentUser.email,
    age: age !== undefined ? Number(age) : currentUser.age
  };

  users[userIndex] = updatedUser;

  res.status(200).json({
    success: true,
    message: 'User updated successfully.',
    data: updatedUser
  });
};

/**
 * @route   DELETE /users/:id
 * @desc    Delete user by ID
 * @access  Public
 */
export const deleteUser = (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `User with ID "${id}" not found.`
    });
  }

  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);

  res.status(200).json({
    success: true,
    message: `User with ID "${id}" has been deleted successfully.`,
    data: deletedUser
  });
};
