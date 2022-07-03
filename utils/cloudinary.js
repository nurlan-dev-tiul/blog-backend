const cloudinary = require('cloudinary');



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