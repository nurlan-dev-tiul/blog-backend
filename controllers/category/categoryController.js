const asyncHandler = require('express-async-handler');
const Category = require('../../model/Category');
const validateMongoDbId = require('../../utils/validateId');

//*=============================================================
//* Добавление категории = Controller
//*=============================================================
const createCategoryController = asyncHandler(async(req, res) => {
    //! Проверка категории существует ли такая
    const categoryExists = await Category.findOne({title: req.body.title});
    if(categoryExists) {
        throw new Error('Такая категория уже существует')
    }
    try {
        const category = await Category.create({
            user: req.user._id,
            title: req.body.title
        });
        res.json(category);
    } catch (error) {
        res.json(error);
    }
});

//*=============================================================
//* Получение всех категории = Controller
//*=============================================================
const getAllCategoryController = asyncHandler(async(req, res) => {
    try {
        const categories = await Category.find({}).populate('user');
        res.json(categories);
    } catch (error) {
        res.json(error);
    }
});

//*=============================================================
//* Получение конкретной категории = Controller
//*=============================================================
const getSingleCategoryController = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const category = await Category.findById(id).populate('user');
        res.json(category);
    } catch (error) {
        res.json(error);
    }
});

//*=============================================================
//* Редактирование конкретной категории = Controller
//*=============================================================
const updateCategoryController = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const category = await Category.findByIdAndUpdate(id, {
            title: req.body.title
        }, {new: true, runValidators: true});
        res.json(category);
    } catch (error) {
        res.json(error);
    }
});

//*=============================================================
//* Удаление категории = Controller
//*=============================================================
const deleteCategoryController = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const category = await Category.findByIdAndRemove(id);
        res.json({category, msg: 'Категория удалена'});
    } catch (error) {
        res.json(error);
    }
});

module.exports = {
    createCategoryController,
    getAllCategoryController,
    getSingleCategoryController,
    updateCategoryController,
    deleteCategoryController
}