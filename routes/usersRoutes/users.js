const express = require('express');
const { 
    detailUserController,
    uploadProfilePhotoController,
    updateProfileController
} = require('../../controllers/users/usersController');
const authMiddlware = require('../../middlware/auth/authMiddlware');
const { photoUpload, profilePhotoResizing } = require('../../middlware/upload/photoUpload');

const userRoutes = express.Router();

// userRoutes.delete('/:id', deleteUserController);
userRoutes.get('/:id', detailUserController);
userRoutes.put(
    '/upload', 
    authMiddlware, 
    photoUpload.single('image'), 
    profilePhotoResizing,
    uploadProfilePhotoController
);
userRoutes.put('/edit', authMiddlware, updateProfileController);

module.exports = userRoutes;


