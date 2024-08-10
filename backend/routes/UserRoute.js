const mongoose = require('mongoose');
const express = require('express');
const userController = require('../controller/UserController');
const router = express.Router();
const User = require('../models/User');


router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/?email=:email', userController.getUserByEmail);
router.get('/?id=:id', userController.getUserById);
router.get('/', userController.getAllUsers);
router.put('/update', userController.updateUser);
router.delete('/delete?id=:id', userController.deleteUser);




module.exports = router;

