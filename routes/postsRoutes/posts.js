const express = require('express');
const { 
    createPostController,
    getPostsController,
    getSinglePostController,
    updatePostController,
    deletePostController,
    addLikeToPostController,
    postByCategoryController,
    updateImagePostController,
    getPopularPostsController
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

postRoutes.put(
    '/image/:id', 
    authMiddlware,
    photoUpload.single('image'),
    postPhotoResizing,
    updateImagePostController
);

postRoutes.put(
    '/update/:id', 
    authMiddlware,
    updatePostController
);


//* Likes Route
postRoutes.put('/likes', authMiddlware, addLikeToPostController);
postRoutes.delete('/delete/:id', authMiddlware, deletePostController);
postRoutes.get('/category/:id', postByCategoryController);
postRoutes.get('/', getPostsController);
postRoutes.get('/popular-posts', getPopularPostsController);
postRoutes.get('/:id', getSinglePostController);






module.exports = postRoutes;