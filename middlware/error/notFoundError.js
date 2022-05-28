const notFoundError = (req, res, next) => {
    const error = new Error(`Неправильный URL - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

module.exports = notFoundError;