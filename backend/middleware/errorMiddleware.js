module.exports.notFound = (req, res, next) => {
    const error = new Error(`Not Found- ${req.originalUrl}`)
    res.status(404);
    next(error);
}

module.exports.errorHandler = (err, req, res, next) => {
    let statusCode = req.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err.name === "CastError" && err.kind === "ObjectId") {
        statusCode = 404;
        message = "Resource not found";
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    })

}