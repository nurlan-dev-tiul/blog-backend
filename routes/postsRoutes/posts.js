const express = require('express');
const { 
    createPostController,
    getPostsController,
    getSinglePostController,
    updatePostController,
    deletePostController,
    addLikeToPostController,
} = require('../../controllers/posts/postsController');
const authMiddlware = require('../../middlware/auth/authMiddlware');
const { photoUpload, postPhotoResizing } = require('../../middlware/upload/photoUpload');

const postRoutes = express.Router();

postRoutes.post(
    '/create', 
    authMiddlware, 
    photoUpload.single('image'),
    postPhotoResizing,
    createPostController
);

//* Likes Route
postRoutes.put('/likes', authMiddlware, addLikeToPostController);

postRoutes.put('/update/:id', authMiddlware, updatePostController);
postRoutes.delete('/delete/:id', authMiddlware, deletePostController);
postRoutes.get('/', getPostsController);
postRoutes.get('/:id', getSinglePostController);






module.exports = postRoutes;