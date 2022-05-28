const express = require('express');
const { 
    createCommentController, 
    getCommentsController, 
    getSingleCommentController, 
    updateCommentController, 
    deleteCommentController
} = require('../../controllers/comments/commentController');
const authMiddlware = require('../../middlware/auth/authMiddlware');

const commentRoutes = express.Router();

commentRoutes.post('/create', authMiddlware, createCommentController);
commentRoutes.get('/', getCommentsController);
commentRoutes.get('/:id', authMiddlware, getSingleCommentController);
commentRoutes.put('/:id', authMiddlware, updateCommentController);
commentRoutes.delete('/:id', authMiddlware, deleteCommentController);


module.exports = commentRoutes;