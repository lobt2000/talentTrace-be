const User = require('../models/userModel')
const AppError = require('../utils/appErrorClass')
const catchAsync = require('../utils/catchAsync')
const factory = require('../utils/handlerFactory')

// eslint-disable-next-line no-unused-vars
exports.getInitUserInfo = catchAsync(async (req, res, next) => {
    factory.sendRequest(res, req.user, 200)
})

// eslint-disable-next-line no-unused-vars
exports.getAllManagers = catchAsync(async (req, res, next) => {
    const managers = (await User.find({})).filter(
        (el) => el.status?.name !== 'Pending'
    )
    factory.sendRequest(res, managers, 200)
})

// eslint-disable-next-line no-unused-vars
exports.getManagerById = factory.getOne(User)

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

    factory.sendRequest(res, { id: newManager.id }, 201)
})

exports.deleteManager = factory.deleteOne(User)

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

    factory.sendRequest(res, { id: user.id }, 200)
})
