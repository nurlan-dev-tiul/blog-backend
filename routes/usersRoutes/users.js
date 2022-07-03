const express = require('express');
const cloudinary = require('cloudinary');
const { 
    detailUserController,
    uploadProfilePhotoController,
    updateProfileController
} = require('../../controllers/users/usersController');
const authMiddlware = require('../../middlware/auth/authMiddlware');
const { photoUpload, profilePhotoResizing } = require('../../middlware/upload/photoUpload');

//! Подключаемся к сервису
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const userRoutes = express.Router();

// userRoutes.delete('/:id', deleteUserController);
userRoutes.get('/:id', detailUserController);
userRoutes.put(
    '/upload',
    authMiddlware,
    uploadProfilePhotoController
);
userRoutes.put('/edit', authMiddlware, updateProfileController);

module.exports = userRoutes;

    // photoUpload.single('image'), 
    // profilePhotoResizing,
