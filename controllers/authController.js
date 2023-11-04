const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/appErrorClass')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')
const Company = require('../models/companyModel')
const notifficationConst = require('../constants/notiffications.contant')

const signToken = (id) =>
    jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)

    const cookieObj = {
        expires: new Date(
            Date.now() - process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    }

    res.cookie('jwt', token, cookieObj)

    user.password = undefined

    res.status(statusCode).json({
        status: 'success',
        access_token: token,
        expires_at: cookieObj.expires,
        token_type: 'Bearer',
    })
}

// eslint-disable-next-line no-unused-vars
exports.signUpCompany = catchAsync(async (req, res, next) => {
    const newUser = await Company.create({
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        passwordChangedAt: req.body.passwordChangedAt,
    })

    createAndSendToken(newUser, 201, res)
})

// eslint-disable-next-line no-unused-vars
exports.signUpManager = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        email: req.body.email,
        companyEmail: req.body.companyEmail,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        passwordChangedAt: req.body.passwordChangedAt,
        firstName: 'Please change me',
        surName: 'Please change me',
        workEmail: req.body.email,
        status: {
            id: 1,
            name: 'Pending',
        },
    })

    const companyUser = await Company.findOne({ email: req.body.companyEmail })

    if (!companyUser) {
        return next(
            new AppError(
                'Company user not found, please provide correct email',
                404
            )
        )
    }

    const notiffication = companyUser.notiffications.find(
        (el) =>
            el.from === newUser.email &&
            el.notifyType === notifficationConst.notifyType[0] &&
            el.active === true
    )

    if (notiffication) {
        return next(
            new AppError(
                'You have already send request, please wait reply',
                404
            )
        )
    }

    companyUser.notiffications.push({
        from: newUser.email,
        notifyType: notifficationConst.notifyType[0],
        notifyText: notifficationConst.notifyText.acceptionRequest,
        active: true,
        date: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }),
        managerId: newUser._id,
    })

    await companyUser.save({ validateBeforeSave: false })

    res.status(201).json({
        status: 'success',
        data: {
            newUser,
        },
    })
})

exports.loginByCompany = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(
            new AppError('Please provide valid email and password', 400)
        )
    }

    const user = await Company.findOne({ email }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    createAndSendToken(user, 200, res)
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(
            new AppError('Please provide valid email and password', 400)
        )
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    createAndSendToken(user, 200, res)
})

exports.protect = catchAsync(async (req, res, next) => {
    let token
    const authHeaders = req.headers.authorization
    if (authHeaders && authHeaders.includes('Bearer')) {
        token = authHeaders.split(' ')[1]
    }

    if (!token) {
        return next(
            new AppError(
                'You are not logged in! Please log in to get access',
                401
            )
        )
    }

    const decodedToken = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
    )

    const user = await User.findById(decodedToken.id)
    const company = await Company.findById(decodedToken.id)
    const generalUser = user || company
    if (!generalUser) {
        return next(
            new AppError(
                'The user belonging to the token is no exist anymore',
                401
            )
        )
    }

    req.user = generalUser
    next()
})

exports.restrictTo =
    (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'You dont have permission to perform this action',
                    403
                )
            )
        }
        next()
    }

exports.updateManagerPassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.body.id).select('+password')

    if (!user) {
        return next(new AppError('User not found', 401))
    }

    user.password = req.body.password
    user.confirmPassword = req.body.confirmPassword

    await user.save()
    createAndSendToken(user, 200, res)
})
