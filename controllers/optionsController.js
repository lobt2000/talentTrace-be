const ScoreOptions = require('../models/scoreOptionsModel')
const StageOptions = require('../models/stageOptionsModel')
const catchAsync = require('../utils/catchAsync')
const factory = require('../utils/handlerFactory')

// eslint-disable-next-line no-unused-vars
exports.getAllScoreOptions = catchAsync(async (req, res, next) => {
    const scoreOptions = await ScoreOptions.find({})
    factory.sendRequest(res, scoreOptions, 200)
})

// eslint-disable-next-line no-unused-vars
exports.createScoreOption = catchAsync(async (req, res, next) => {
    const scoreOptions = await ScoreOptions.create({
        ...req.body,
    })

    factory.sendRequest(res, { scoreOptions }, 201)
})

exports.deleteScoreOption = factory.deleteOne(ScoreOptions)

// eslint-disable-next-line no-unused-vars
exports.getAllStageOptions = catchAsync(async (req, res, next) => {
    const stageOptions = await StageOptions.find({})
    factory.sendRequest(res, stageOptions, 200)
})

// eslint-disable-next-line no-unused-vars
exports.createStageOption = catchAsync(async (req, res, next) => {
    const stageOptions = await StageOptions.create({
        ...req.body,
    })

    factory.sendRequest(res, { stageOptions }, 201)
})

exports.deleteStageOption = factory.deleteOne(StageOptions)
