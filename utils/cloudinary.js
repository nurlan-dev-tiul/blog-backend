const cloudinary = require('cloudinary');

//! Подключаемся к сервису
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//! Загружаем картинку на сервис
const cloudinaryUploadImg = async (fileToUpload) => {
    try {
        const data = await cloudinary.uploader.upload(fileToUpload, {
            resource_type: 'auto',
        });
        return {
            url: data.secure_url
        };
    } catch (error) {
        return error;
    }
};

module.exports = cloudinaryUploadImg;