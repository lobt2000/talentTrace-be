const User = require('../models/userModel')
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
    const managers = await User.find({})
    res.status(200).json({
        status: 'success',
        managers: managers,
    })
})
