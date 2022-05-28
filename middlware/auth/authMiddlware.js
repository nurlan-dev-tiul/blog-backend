const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../../model/User');

//! Здесь описана логика для расшифровки токена который отправил нам клиент
const authMiddlware = asyncHandler(async (req, res, next) => {
    let token;

    //! Если токен есть в headers authorization, 
    //! если клиент его нам отправил в запросе
    if(req?.headers?.authorization?.startsWith('Bearer')){
        try {
            //! Тут мы делим Bearar и token, и берем первую после пробела [1] это токен по индексу
            token = req.headers.authorization.split(' ')[1];

            //! Если токен есть, декодируем его
            if(token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

                //! Теперь когда расшифровали токен, в нем лежит id пользователя 
                //! Проверяем его в БД
                const user = await User.findById(decoded.id).select('-password');

                //! И прикрепляем этого пользователя к запросу 
                req.user = user;
                next();
            }
        } catch (error) {
            throw new Error('Срок действия токена истек');
        }
    }else{
        throw new Error('Нет токена в headers')
    }
});

module.exports = authMiddlware;

