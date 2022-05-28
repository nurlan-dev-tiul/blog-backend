const express = require('express');
const { 
    detailUserController,
    followingUserController,
    unFollowController,
    uploadProfilePhotoController,
    updateProfileController
} = require('../../controllers/users/usersController');
const authMiddlware = require('../../middlware/auth/authMiddlware');
const { photoUpload, profilePhotoResizing } = require('../../middlware/upload/photoUpload');

const userRoutes = express.Router();

//! Подписка и отписка
userRoutes.put('/follow', authMiddlware, followingUserController);
userRoutes.put('/unfollow', authMiddlware, unFollowController);

// userRoutes.delete('/:id', deleteUserController);
userRoutes.get('/:id', detailUserController);
userRoutes.put(
    '/profile-photo-upload', 
    authMiddlware, 
    photoUpload.single('image'), 
    profilePhotoResizing,
    uploadProfilePhotoController
);
userRoutes.put('/edit', authMiddlware, updateProfileController);


module.exports = userRoutes;


