// const Company = require('../models/companyModel')
const User = require('../models/userModel')
const AppError = require('../utils/appErrorClass')
const catchAsync = require('../utils/catchAsync')

// eslint-disable-next-line no-unused-vars
exports.getInitUserInfo = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        user: req.user,
    })
})

// eslint-disable-next-line no-unused-vars
exports.getAllManagers = catchAsync(async (req, res, next) => {
    const managers = (await User.find({})).filter(
        (el) => el.status?.name !== 'Pending'
    )
    res.status(200).json({
        status: 'success',
        managers: managers,
    })
})

// eslint-disable-next-line no-unused-vars
exports.getManagerById = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    })
})

// eslint-disable-next-line no-unused-vars
exports.createManager = catchAsync(async (req, res, next) => {
    const newManager = await User.create({
        ...req.body,
        email: req.body.workEmail,
        password: 'test1234',
        confirmPassword: 'test1234',
        companyEmail: req.user.email,
    })

    delete newManager.password

    res.status(201).json({
        status: 'success',
        data: {
            id: newManager.id,
        },
    })
})

exports.deleteManager = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
        return next(new AppError('No document found with that ID', 404))
    }
    res.status(204).json({
        status: 'success',
        data: null,
    })
})

exports.updateManager = catchAsync(async (req, res, next) => {
    const body = {
        ...req.body,
        name: req.body.firstName + ' ' + req.body.surName,
        fullPosition: req.body.level.name + ' ' + req.body.position.name,
    }
    const user = await User.findByIdAndUpdate(req.params.id, body, {
        new: true,
        runValidators: true,
    })

    if (!user) {
        return next(new AppError('No document found with that ID', 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            id: user.id,
        },
    })
})
