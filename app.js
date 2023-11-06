const express = require('express')
const { default: helmet } = require('helmet')
// const path = require('path');
// const rateLinit = require('express-rate-limit')
const xss = require('xss-clean')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const globalErrorHandler = require('./utils/errorHandler')
const AppError = require('./utils/appErrorClass')
const authRouter = require('./routers/authRoutes')
const initRouter = require('./routers/initRoutes')
const managersRouter = require('./routers/managersRoutes')
const companyRoutes = require('./routers/companyRoutes')
const employeesRoutes = require('./routers/employeesRoutes')

// const hpp = require('hpp');

const app = express()

// Set Security HTTP headers
app.use(helmet())

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// limit request from same abi
// const limiter = rateLinit({
//     max: 100,
//     windowMs: 60 * 60 * 1000,
//     message: 'Too many request from this IP, please try again in an hour',
// })

// app.use('/api', limiter)

// Readinfg data from a body to req.body
app.use(
    express.json({
        limit: '10kb',
    })
)

app.use(cookieParser())

// Data sanitization agains NoSQL query injection

app.use(mongoSanitize())

// Data sanitization agains XSS

app.use(xss())

//Prevent parameter polution

// app.use(
//   hpp({
//     whitelist: ['duration'],
//   })
// );

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

// 3 ROUTES

app.use('/api/v1/', authRouter)
app.use('/api/v1/users', initRouter)
app.use('/api/v1/managers', managersRouter)
app.use('/api/v1/company', companyRoutes)
app.use('/api/v1/employees', employeesRoutes)

app.all('*', (req, res, next) => {
    next(
        new AppError(
            `Cant find ${req.originarUrl || 'route'} on this server`,
            404
        )
    )
})

app.use(globalErrorHandler)

module.exports = app
