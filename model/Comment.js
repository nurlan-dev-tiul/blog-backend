const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    //! Здесь будет лежать id статьи которому мы написали комментарии
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Отсутствует ID статьи = (comment)']
    },
    //! Здесь будет лежать обьект о пользователе
    user: {
        type: Object,
        required: [true, 'Отсутствует ID пользователя = (comment)']
    },
    description: {
        type: String,
        required: [true, 'Поле description = обьязательно = (comment)']
    }
}, {timestamps: true});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment