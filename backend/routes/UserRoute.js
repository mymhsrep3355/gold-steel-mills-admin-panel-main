const mongoose = require('mongoose');
const express = require('express');
const userController = require('../controller/UserController');
const router = express.Router();
const User = require('../models/User');

router.get('/email/:email', userController.getUserByEmail); // Get user by email
router.get('/id/:id', userController.getUserById); // Get user by ID
router.get('/', userController.getAllUsers); // Get all users


router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);

router.delete('/delete/:id', userController.deleteUser); // Delete user by ID

router.put('/update/:id', userController.updateUser); // Update user by ID
router.put('/changeAccountStatus/:id', userController.changeAccountStatus); // Change account status by ID




module.exports = router;

