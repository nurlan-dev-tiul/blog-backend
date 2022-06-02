const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    firstName: {
        required: [true, 'Имя обьязательно'],
        type: String,
    },
    lastName: {
        type: String,
    },
    profilePhoto: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    },
    email: {
        type: String,
        required: [true, 'Email обьязательно'],
    },
    password: {
        type: String,
        required: [true, 'Пароль обьязательно'],
    },
    postCount: {
        type: Number,
        default: 0,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['Admin', 'Guest', 'Blogger'],
    },
    isFollowing: {
        type: Boolean,
        default: false,
    },
    isUnFollowing: {
        type: Boolean,
        default: false,
    },

    //! Какие пользователи просмотрели, ссылаемся на User
    viewedBy: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    //! Список подписчиков, также тут будут храниться Id пользователей которые подписаны
    followers: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    //! Также тут будут храниться Id пользователей на которых подписан я
    following: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    
    active: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

//* Создаем виртуальное свойство posts где будут лежать ссылки на наши статьи
userSchema.virtual('posts', {
    ref: 'Post', //! Ссылка на модель Post
    foreignField: 'user', //! Ссылка на свойство user в модели Post, там лежит id пользователя
    localField: '_id',
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

//* ================ Hash Password При регистрации
userSchema.pre('save', async function(next){

    //! Здесь мы говорим если password в userSchema был не изменен тогда next()
    if (!this.isModified("password")) {
        next();
    }

    //! Генерируем соль из 10 символов
    const salt = await bcrypt.genSalt(10);

    //! Создаем hash, this ссылаеться на обьект userSchema и его свойствам password, firstName и т.д
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//* ============== Расшифровываем Пароль и сравниваем hash пароль с паролем из клиента
userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
};


const User = mongoose.model('User', userSchema);
module.exports = User;

