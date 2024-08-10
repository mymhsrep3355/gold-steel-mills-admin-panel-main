// Import the required modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();
// Import the User model
const User = require('../models/User');

/**
 * Creates a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} The created user.
 */
async function createUser(req, res) {
  // Check if required fields are present
  if (!req.body.name || !req.body.email || !req.body.password) {
    // Return an error response if any required field is missing
    console.log('Missing required fields');
    return res.status(400).send('Missing required fields');
  }

  // Hash the password
  const user = new User({
    // Create a new user object with the provided fields
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  try {
    // Save the user to the database
    const savedUser = await user.save();
    console.log('User created:', savedUser);
    // Return the created user in the response
    res.send(savedUser);
  } catch (err) {
    // Return an error response if there was an error saving the user
    console.log('Error saving user:', err.message);
    res.status(400).send(err.message);
  }
}

/**
 * Logs in a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} The authentication token.
 */
async function loginUser(req, res) {
  // Check if required fields are present
  if (!req.body.email || !req.body.password) {
    // Return an error response if any required field is missing
    console.log('Missing required fields');
    return res.status(400).send('Missing required fields');
  }

  // Find the user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    // Return an error response if the user was not found
    console.log('Invalid email or password');
    return res.status(401).send('Invalid email or password');
  }

  // Check if the password is correct
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    // Return an error response if the password is incorrect
    console.log('Invalid email or password');
    return res.status(401).send('Invalid email or password');
  }

  // Generate the authentication token
  const token = jsonwebtoken.sign({ user: user }, process.env.JWT_SECRET);

  // Return the authentication token in the response
  console.log('User logged in:', user);
  res.send({ token });
}

/**
 * Changes the account status of a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} The updated user.
 */
async function changeAccountStatus(req, res) {
  // Check if the user ID is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    // Return an error response if the user ID is invalid
    console.log('Invalid user ID');
    return res.status(400).send('Invalid user ID');
  }

  // Find the user by ID
  const user = await User.findById(req.params.id);
  if (!user) {
    // Return an error response if the user was not found
    console.log('User not found');
    return res.status(404).send('User not found');
  }

  // Toggle the account status
  user.account_status = !user.account_status;
  await user.save();
  // Return the updated user in the response
  console.log('User account status changed:', user);
  res.send(user);
}

/**
 * Retrieves all users.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} The list of users.
 */
async function getAllUsers(req, res) {
  // Find all users in the database
  const users = await User.find();
  // Return the list of users in the response
  console.log('Users retrieved:', users);
  res.send(users);
}

/**
 * Retrieves a user by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} The user.
 */
async function getUserById(req, res) {
  // Check if the user ID is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    // Return an error response if the user ID is invalid
    console.log('Invalid user ID');
    return res.status(400).send('Invalid user ID');
  }

  // Find the user by ID
  const user = await User.findById(req.params.id);
  if (!user) {
    // Return an error response if the user was not found
    console.log('User not found');
    return res.status(404).send('User not found');
  }

  // Return the user in the response
  console.log('User retrieved:', user);
  res.send(user);
}

/**
 * Retrieves a user by email.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} The user.
 */
async function getUserByEmail(req, res) {
  // Find the user by email
  const user = await User.findOne({ email: req.params.email });
  if (!user) {
    // Return an error response if the user was not found
    console.log('User not found');
    return res.status(404).send('User not found');
  }

  // Return the user in the response
  console.log('User retrieved:', user);
  res.send(user);
}

/**
 * Updates a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} The updated user.
 */
async function updateUser(req, res) {
  // Check if the user ID is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    // Return an error response if the user ID is invalid
    console.log('Invalid user ID');
    return res.status(400).send('Invalid user ID');
  }

  // Find and update the user by ID
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) {
    // Return an error response if the user was not found
    console.log('User not found');
    return res.status(404).send('User not found');
  }

  // Return the updated user in the response
  console.log('User updated:', user);
  res.send(user);
}

/**
 * Deletes a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} The deleted user.
 */
async function deleteUser(req, res) {
  // Check if the user ID is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    // Return an error response if the user ID
    // Return an error response if the user ID is invalid
    return res.status(400).send('Invalid user ID');
  }

  // Find and delete the user by ID
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    // Return an error response if the user was not found
    return res.status(404).send('User not found');
  }

  // Return the deleted user in the response
  res.send(user);
}

// Export the controller functions
module.exports = {
  createUser,
  loginUser,
  changeAccountStatus,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};


