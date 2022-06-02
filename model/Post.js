const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Поле title - обьязательно'],
        trim: true
    },
    category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
    },
    //! Просмотры
    numViews: {
        type: Number,
        default: 0
    },
    //! Если лайкнули станет true и тогда мы можем манипулировать на клиенте иконкой задать цвет лайкнутого поста
    isLiked: {
        type: Boolean,
        default: false
    },
    //! Пользователи которые лайкнули мои статьи
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    //! Пользователь к которому относиться эта статья, автор статьи
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Поле автора статьи обьязательна']
    },
    description: {
        type: String,
        required: [true, 'Поле description - обьязательно']
    },
    image: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2021/10/11/13/12/website-6700615_960_720.png'
    },
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
});



//! Виртуальные поля для комментариев
postSchema.virtual('comments', {

    //! Заходим на модель Comment и в свойстве post смотрим если там есть id конкретной статьи то привязываем
    //! этот комментарии к статье и отправляем на клиент и статью и его комментарии
    ref: 'Comment', //! Ссылка на модель Comment
    foreignField: 'post', //! Ссылка на свойство post в модели Comment, там лежит id статьи
    localField: '_id'
});

postSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
    })
    next();
});

//! Pagination
postSchema.plugin(mongoosePaginate);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;