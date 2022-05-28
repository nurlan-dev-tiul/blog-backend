const asyncHandler = require('express-async-handler');
const Comment = require('../../model/Comment');
const validateMongoDbId = require('../../utils/validateId');

//*=============================================================
//* Добавляем комментарии = Controller
//*=============================================================
const createCommentController = asyncHandler(async(req, res) => {
    //! Берем все данные пользователя из токена
    const user = req.user;

    //! Берем id статьи, и description
    const { postId, description } = req.body;
    try {
        const comment = await Comment.create({
            post: postId,
            user,
            description
        })
        res.json(comment);
    } catch (error) {
        res.json(error);
    }
    
});

//*=============================================================
//* Получаем все комментарии = Controller
//*=============================================================
const getCommentsController = asyncHandler(async(req, res) => {
    try {
        const comments = await Comment.find({}).sort('-createdAt');
        res.json(comments);
    } catch (error) {
        res.json(error)
    }
    
});

//*=============================================================
//* Получаем конкретный комментарий = Controller
//*=============================================================
const getSingleCommentController = asyncHandler(async(req, res) => {
    //! Получаем id комментария
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const comment = await Comment.findById(id);
        res.json(comment);
    } catch (error) {
        res.json(error)
    }
    
});

//*=============================================================
//* Редактируем комментарий = Controller
//*=============================================================
const updateCommentController = asyncHandler(async(req, res) => {
    //! Получаем id комментария
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const comment = await Comment.findByIdAndUpdate(id, {
            user: req.user,
            description: req.body.description
        }, {new: true, runValidators: true});
        res.json(comment);
    } catch (error) {
        res.json(error)
    }
    
});

//*=============================================================
//* Удаляем комментарий = Controller
//*=============================================================
const deleteCommentController = asyncHandler(async(req, res) => {
    //! Получаем id комментария
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const comment = await Comment.findByIdAndDelete(id);
        res.json(comment);
    } catch (error) {
        res.json(error)
    }
    
});


module.exports = {
    createCommentController,
    getCommentsController,
    getSingleCommentController,
    updateCommentController,
    deleteCommentController
}