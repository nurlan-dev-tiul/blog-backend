const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

//! тип хранилища будет memoryStorage, есть еще diskStorage, это когда мы хотим файлы хранить в папке у себя на сервере
const multerStorage = multer.memoryStorage();

//! Фильтруем файлы говорим что загружать можем только Image то есть изображения
const multerFilter = (req, file, cb) => {

    //! Если тип файла Image
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    }else{
        cb({
            message: 'Неподдерживаемый формат файла'
        }, false);
    }
};

const photoUpload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 1000000 } //! 1mb
});

//! Изменение размера картинки для профиля
const profilePhotoResizing = async (req, res, next) => {
    //! Проверяем если нет файла тогда пропускаем эту функцию
    if(!req.file) return next();

    //! Изменяем имя файла который пришел, чтоб не было похожих имен
    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

    await sharp(req.file.buffer)
        .resize(250, 250) //! width, height 
        .toFormat('jpeg') //! изменяем формат на jpeg
        .jpeg({quality: 90}) //! Качество 90
        .toFile(path.join(`public/images/profile/${req.file.filename}`));
    next();
};


//! Изменение размера картинки для постов
const postPhotoResizing = async (req, res, next) => {
    //! Проверяем если нет файла тогда пропускаем эту функцию postPhotoResizing
    if(!req.file) return next();

    //! Изменяем имя файла который пришел, чтоб не было похожих имен
    req.file.filename = `post-${Date.now()}-${req.file.originalname}`;

    await sharp(req.file.buffer)
        .resize(950, 950) //! width, height 
        .toFormat('jpeg') //! изменяем формат на jpeg
        .jpeg({quality: 90}) //! Качество 90
        .toFile(path.join(`public/images/posts/${req.file.filename}`));
    next();
};

module.exports = {photoUpload, profilePhotoResizing, postPhotoResizing};