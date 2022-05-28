const asyncHandler = require('express-async-handler');
const fs = require('fs');
const Post = require('../../model/Post');
const validateMongoDbId = require('../../utils/validateId');
const User = require('../../model/User');
const cloudinaryUploadImg = require('../../utils/cloudinary');

//*=============================================================
//* Добавляем новую статью = Controller
//*=============================================================

const createPostController = asyncHandler(async (req, res) => {
    //! Получаем id из токена
    const { _id } = req.user;
    //! Проверяем валидный ли id у пользователя
    // validateMongoDbId(req.body.user);
    console.log(req);

    //! Находим картинки которые мы положили в папку images
    const localPath = `public/images/posts/${req.file.filename}`;

    //! Загружаем эту картинку в cloudinary, и URL к этой картинке у нас лежит в imgUpload
    const imgUpload = await cloudinaryUploadImg(localPath);
    try {
        const post = await Post.create({...req.body, user: _id, image: imgUpload.url});
        res.json(post);
        console.log(post);

        //! После загрузки на cloudinary очищаем папку images/posts
        // fs.unlinkSync(localPath);
    } catch (error) {
        res.json(error)
    }
});

//*=============================================================
//* Отправляем все статьи или статьи по конкретной категории = Controller
//*=============================================================
const getPostsController = asyncHandler(async(req, res) => {

    //! Здесь мы получаем название категории
    const hasCategory = req.query.category;

    try {
        //! Если в req.query.catgeory есть название категории то отправляй только те статьи
        //! свойство category котороая соответствует req.query.catgeory
        if(hasCategory) { 
            const posts = await Post.find({category: hasCategory})
            .sort('-createdAt').populate('comments').populate('user', 'firstName')
            res.json(posts);
        }else{
            const posts = await Post.find({}).sort('-createdAt').populate('comments').populate('user');
            res.json(posts);
        }
        
        
    } catch (error) {
        res.json(error);
    }
});

//*=============================================================
//* Получаем одну конкретную статью, добавляем просмотры = Controller
//*=============================================================
const getSinglePostController = asyncHandler(async (req, res) => {
    //! Получаем id статьи из параметров url
    const { id } = req.params;

    //! Проверяем валидный ли id есть ли статья с таким id
    validateMongoDbId(id);

    try {
        //! Делаем запрос в БД
        const post = await Post.findById(id)
            .populate('comments') //! Comment
            .populate('user') //! Пользователь который создал статью

        //! Свойство numViews = просмотры
        await Post.findByIdAndUpdate(id, {
            $inc: {numViews: 1}
        }, {new: true});
        res.json(post);
    } catch (error) {
        res.json(error);
    }
});

//*=============================================================
//* Редактирование статьи = Controller
//*=============================================================
const updatePostController = asyncHandler(async (req, res) => {
    //! Получаем id статьи из параметров url
    const { id } = req.params;

    //! Проверяем валидный ли id есть ли статья с таким id
    validateMongoDbId(id);
    try {
        const post = await Post.findByIdAndUpdate(id, {
            ...req.body, 
            user: req.user._id
        }, {new: true});

        res.json(post);
    } catch (error) {
        res.json(error)
    }
    
});

//*=============================================================
//* Удаление статьи = Controller
//*=============================================================
const deletePostController = asyncHandler(async (req, res) => {
    //! Получаем id статьи из параметров url
    const { id } = req.params;

    //! Проверяем валидный ли id есть ли статья с таким id
    validateMongoDbId(id);
    try {
        await Post.findByIdAndDelete(id);
        res.json('Статья была удалена');
    } catch (error) {
        res.json(error)
    }
});

//*=============================================================
//* Добавление лайков = Controller
//*=============================================================
const addLikeToPostController = asyncHandler(async(req, res) => {
    //! Получаем id статьи и находим ее в БД
    const { postId } = req.body;
    const post = await Post.findById(postId);
    //! Получаем id из токена пользователя
    const loginUserId = req.user._id;

    //! Получаем статус наш isLiked (по умолчанию у нас стоит false)
    const isLiked = post.isLiked;

    //? Toggle = эта функция работает как в инстаграм 
    //! Если статус isLiked: true, а пользователь еще раз кликнул кнопку лайка тогда мы удалим его из массива likes
    //! и поставим статус isLiked: false, это делается чтобы один и тот же пользователь не смог лайкнуть одну и ту же
    //! статью 2 раза и более
    if(isLiked){
        const post = await Post.findByIdAndUpdate(postId, {
            $pull: {likes: loginUserId},
            isLiked: false
        }, {new: true});
        res.json(post);
    }else{
        //! Если статус isLiked: false тогда добавляем пользователя в массив likes и ставим статус true
        const post = await Post.findByIdAndUpdate(postId, {
            $push: {likes: loginUserId},
            isLiked: true
        }, {new: true});
        res.json(post);
    }
});


module.exports = {
    createPostController,
    getPostsController,
    getSinglePostController,
    updatePostController,
    deletePostController,
    addLikeToPostController,
}