const Candidates = require('../models/candidateModel')
const AppError = require('../utils/appErrorClass')
const catchAsync = require('../utils/catchAsync')
const factory = require('../utils/handlerFactory')

// eslint-disable-next-line no-unused-vars
exports.getAllCandidates = catchAsync(async (req, res, next) => {
    const candidates = await Candidates.find(
        {},
        { stages: { $slice: 1 } }
    ).select({
        name: 1,
        id: 1,
        stages: { name: 1, scores: 1 },
    })
    factory.sendRequest(res, candidates, 200)
})

// eslint-disable-next-line no-unused-vars
exports.createCandidate = catchAsync(async (req, res, next) => {
    const cand = JSON.parse(req.body.candidate)
    const file = {
        ...cand.cv,
        data: req.body.data,
    }
    const candidate = await Candidates.create({
        ...cand,
        cv: file,
    })
    factory.sendRequest(res, { id: candidate.id }, 201)
})

exports.deleteCandidate = factory.deleteOne(Candidates)

exports.getCandidateById = catchAsync(async (req, res, next) => {
    let query
    if (req.query) {
        query = {
            stages: Number(req.query.type === 'stages'),
        }
    }
    const candidate = await Candidates.findById(req.params.id).select(query)

    if (!candidate) {
        return next(new AppError('No document found with that ID', 404))
    }

    factory.sendRequest(res, candidate, 200)
})

exports.updateCandidate = catchAsync(async (req, res, next) => {
    const cand = JSON.parse(req.body.candidate)
    const file = {
        ...cand.cv,
        data: req.body.data,
    }
    const body = {
        ...cand,
        ...(req.body.data && { cv: file }),
    }
    const candidate = await Candidates.findByIdAndUpdate(req.params.id, body, {
        new: true,
        runValidators: true,
    })

    if (!candidate) {
        return next(new AppError('No document found with that ID', 404))
    }

    factory.sendRequest(res, { id: candidate.id }, 200)
})
