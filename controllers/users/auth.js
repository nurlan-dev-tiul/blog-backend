const asyncHandler = require('express-async-handler');
const fs = require('fs');
const User = require('../../model/User');
const generateToken = require('../../config/token/generateToken');
const validateMongoDbId = require('../../utils/validateId');

//* ---------------------------------
//* Regsiter Logic
//* ---------------------------------
const userRegisterController = asyncHandler(async (req, res) => {
    //! Проверка пользователя существует ли такой
    const userExists = await User.findOne({email: req.body.email});
    console.log(req.body);
    if(userExists) {
        throw new Error('Пользователь с таким Email уже существует')
    }
    try {
        const user = await User.create({
            firstName: req.body.firstName,
            email: req.body.email,
            password: req.body.password
        });

        res.json({
            _id: user._id,
            firstName: user.firstName,
            email: user.email,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.json(error)
    }
    
});

//* ---------------------------------
//* Login Logic
//* ---------------------------------
const userLoginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    
    //! isPasswordMatched = эта функция у нас создана в модели User
    //! Она сравнивает пароль с клиента с захешированным паролем из БД
    if(user && (await user.isPasswordMatched(password))){
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePhoto: user.profilePhoto,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    }else{
        res.status(401);
        throw new Error('Укажите правильный Email или пароль');
    };
});

//* ---------------------------------
//* Profile User Logic 
//* ---------------------------------
const getProfileController = asyncHandler(async (req, res) => {
    const { id } = req.user;

    //! Эта функция вернет сообщение об ошибки если такого ID нет в БД
    validateMongoDbId(id);
    try {
        const profile = await User.findById(id).populate('posts');
        res.json(profile)
    } catch (error) {
        res.json(error)
    }
});

module.exports = {
    userRegisterController,
    userLoginController,
    getProfileController,
}