const asyncHandler = require('express-async-handler');
const fs = require('fs');
const User = require('../../model/User');
const generateToken = require('../../config/token/generateToken');
const validateMongoDbId = require('../../utils/validateId');
const { populate } = require('../../model/User');
const cloudinaryUploadImg = require('../../utils/cloudinary');

//* ---------------------------------
//* Detail User Logic
//* ---------------------------------
const detailUserController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    //! Эта функция вернет сообщение об ошибки если такого ID нет в БД
    validateMongoDbId(id);
    try {
        const user = await User.findById(id)
            .populate('posts')
            .populate('followers')
            .populate('following');
        res.json(user)
    } catch (error) {
        res.json(error)
    }
});

//* --------------------------------------------------------
//* Подписка на кого либо, и мои подписчики
//* --------------------------------------------------------
const followingUserController = asyncHandler(async (req, res) => {

    //! Получаем ID пользователя на которого хотим подписаться
    const { followId } = req.body;

    //! Получаем свое ID из токена
    const loginUserId = req.user.id;

    //! Чтобы на меня один и тот же нескольо раз не подписался или я на кого то много раз не подписался, дубликаты
    //! Сначала находим пользователя на которого хотим подписаться
    const checkUser = await User.findById(followId);

    //! Теперь сравниваем если у пользователя checkUser в массиве followers есть мой id, сообщение = мы уже подписаны
    const alreadyFolowing = checkUser?.followers?.find(user => user?.toString() === loginUserId.toString());
    if(alreadyFolowing) throw new Error('Вы уже подписаны на этого пользователя')

    //! Находим пользователя на которого хотим подписаться и кладем наше ID в его свойство followers
    await User.findByIdAndUpdate(followId, {
        //! Тут мы пушим в массив followers наш ID
        $push: {followers: loginUserId},
        //! Свойство isFollowing из БД(Модель User) делаем true, 
        //! типа подписаны, и на клиенте мы можем уже через это свойство манипулировать рендером
        isFollowing: true
    }, {new: true});

    //! Теперь кладем ID пользователя на которого я подписался в свое свойство following
    const followedUser = await User.findByIdAndUpdate(loginUserId, {
        $push: {following: followId}
    }, {new: true});

    res.json(followedUser)
});

//* --------------------------------------------------------
//* Отписка
//* --------------------------------------------------------
const unFollowController = asyncHandler(async (req, res) => {
    //! Получаем с клиента ID пользователя от которого хотим отписаться
    const { unFollowId } = req.body;

    //! Получаем свое ID из токена
    const loginUserId = req.user.id;

    const checkUser = await User.findById(unFollowId);

    //!Находим пользователя в БД от которого хотим отписаться 
    //! И в его массиве followers удаляем наш ID
    await User.findByIdAndUpdate(unFollowId, {
        $pull: {followers: loginUserId},
        isFollowing: false //! Свойство из Модели User isFollowing делаем false
    }, {new: true});

    //! И также удаляем ID пользователя от которого хотим отписаться из моего массива подписчиков
    const unFollowed =  await User.findByIdAndUpdate(loginUserId, {
        $pull: {following: unFollowId}
    }, {new: true});

    res.json(unFollowed)
});

//* ---------------------------------
//* Update Profile Logic 
//* ---------------------------------
const updateProfileController = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);

    const user = await User.findByIdAndUpdate(_id, {
        firstName: req.body.firstName,
        email: req.body.email,
    }, {
        new: true,
        runValidators: true
    });
    res.json(user)
});

//* ---------------------------------
//* Profile photo upload 
//* ---------------------------------
const uploadProfilePhotoController = asyncHandler(async (req, res) => {
    //! Берем пользователя из токена
    const { _id } = req.user;
    console.log(req.file);
    //! Находим картинки которые мы положили в папку images
    const localPath = `public/images/profile/${req.file.filename}`;

    //! Загружаем эту картинку в cloudinary, и путь к этой картинке у нас лежит в imgUpload
    const imgUpload = await cloudinaryUploadImg(localPath)

    //! Ищем пользователя из токена и обновляем ему свойство ptofilePhoto
    const user = await User.findByIdAndUpdate(_id, {
        profilePhoto: imgUpload.url //! Теперь у нас в профиле будет путь к картинке из cloudinary
    }, {new: true});


    //! Удаляем картинки из папки images/profile после того как загрузили на cloudinary
    fs.unlinkSync(localPath);
    res.json(user.profilePhoto);
});

module.exports = {
    detailUserController,
    followingUserController,
    unFollowController,
    updateProfileController,
    uploadProfilePhotoController
}