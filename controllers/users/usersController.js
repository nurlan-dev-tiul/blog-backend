const asyncHandler = require('express-async-handler');
const fs = require('fs');
const User = require('../../model/User');
const validateMongoDbId = require('../../utils/validateId');
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
        res.json(user)
    } catch (error) {
        res.json(error)
    }
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
    res.status(200).json(user.profilePhoto);
});

module.exports = {
    detailUserController,
    updateProfileController,
    uploadProfilePhotoController
}