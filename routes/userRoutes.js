
const express = require('express');
const UserController = require('../controller/usersController');
const upload = require('../config/multer');
const { validate, userValidation } = require('../middleware/userValidation');

const router = express.Router();

// Create a new user
router.post('/create', validate(userValidation.createUser), UserController.createUser);

// Get user by ID
router.get('/get/:id', UserController.getUser);

// - Get all users
router.get('/getAll', UserController.getAllUsers);

module.exports = router;