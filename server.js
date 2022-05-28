const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors')
const dbConnect = require('./config/db/dbConnect');
const errorHandler = require('./middlware/error/errorHandler');
const notFoundError = require('./middlware/error/notFoundError');
const authRoutes = require('./routes/authRoutes/auth');
const categoryRoutes = require('./routes/categoryRoutes/category');
const postRoutes = require('./routes/postsRoutes/posts');
const commentRoutes = require('./routes/commentRoutes/comment');
const userRoutes = require('./routes/usersRoutes/users');

const app = express();
app.use(express.json());
app.use(cors());


//! Mongo DB Connection
dbConnect();

//! Users Route 
app.use('/api/auth', authRoutes);

//! Users Route 
app.use('/api/user', userRoutes);

//! Category Route 
app.use('/api/category', categoryRoutes);

//! Posts Route 
app.use('/api/posts', postRoutes);

//! Comments Route 
app.use('/api/comments', commentRoutes);

//! Not Found Error = ошибка на неправильный URL адрес Route REST API
app.use(notFoundError);

//! Error Handler = обработчик ошибок middlware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server run 5000');
});


