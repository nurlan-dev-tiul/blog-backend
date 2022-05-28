const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Успешное подключение к Mongo DB');
    } catch (error) {
        console.log(`Ошибка при подключении к MongoDB: ${error.message}`);
    }
}

module.exports = dbConnect;
