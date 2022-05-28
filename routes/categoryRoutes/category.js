const express = require('express');
const { 
    createCategoryController, 
    getAllCategoryController, 
    getSingleCategoryController,
    updateCategoryController,
    deleteCategoryController
} = require('../../controllers/category/categoryController');
const authMiddlware = require('../../middlware/auth/authMiddlware');

const categoryRoutes = express.Router();

categoryRoutes.post('/create', authMiddlware, createCategoryController);
categoryRoutes.get('/all', getAllCategoryController);
categoryRoutes.get('/:id', authMiddlware, getSingleCategoryController);
categoryRoutes.put('/:id', authMiddlware, updateCategoryController);
categoryRoutes.delete('/:id', authMiddlware, deleteCategoryController);

module.exports = categoryRoutes;