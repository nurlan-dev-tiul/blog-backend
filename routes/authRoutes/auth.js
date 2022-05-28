const express = require('express');
const { 
    userRegisterController, 
    userLoginController, 
    getProfileController,
} = require('../../controllers/users/auth');

const authMiddlware = require('../../middlware/auth/authMiddlware');

const authRoutes = express.Router();

//! API ROUTE LOGIC
authRoutes.post('/register', userRegisterController);
authRoutes.post('/login', userLoginController);
authRoutes.get('/profile', authMiddlware, getProfileController);

module.exports = authRoutes;


