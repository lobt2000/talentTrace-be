const AppError = require('./appErrorClass')

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message)
    const message = `Invalid data ${errors.join('. ')}`
    return new AppError(message, 400)
}

const handleJWTError = () =>
    new AppError('Invalid token. Please login again', 401)

const handleJWTExpiredError = () =>
    new AppError('Your tiken has expired. Please login again', 401)

const handleDuplicateFieldsDB = (err) => {
    const message = `Duplicate field value: ${
        err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    }. Please use another value!`
    return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    })
}
// const sendErrorProd = (err, res) => {
//   // Operational, trusted error: send message to client
//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });
//   } else {
//     res.status(500).json({
//       status: 'error',
//       message: 'Something went very wrong',
//     });
//   }
// };

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    let errors
    if (err.errors) {
        errors = Object.values(err.errors).map((el) => el.name)
    }
    //   if (process.env.NODE_ENV === 'development') {
    //     sendErrorDev(err, res);
    //   } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }

    if (error.name === 'CastError') error = handleCastErrorDB(err)

    if (error.code === 11000) error = handleDuplicateFieldsDB(err)
    if (errors && errors.includes('ValidatorError'))
        error = handleValidationErrorDB(error)

    if (error.name === 'JsonWebTokenError') error = handleJWTError()
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()

    sendErrorDev(error, res)
    //   }
}
