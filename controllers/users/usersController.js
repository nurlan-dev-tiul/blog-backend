const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary');
const fs = require('fs');
const User = require('../../model/User');
const validateMongoDbId = require('../../utils/validateId');
const cloudinaryUploadImg = require('../../utils/cloudinary');


//! Подключаемся к сервису
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


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
    
    //! Ищем пользователя из токена и обновляем ему свойство ptofilePhoto
    const user = await User.findByIdAndUpdate(_id, {
        profilePhoto: req.body?.profilePhoto 
    }, {new: true});

    res.json(user.profilePhoto);
});


module.exports = {
    detailUserController,
    updateProfileController,
    uploadProfilePhotoController
}