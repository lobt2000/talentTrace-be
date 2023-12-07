const Vacancy = require('../models/vacanciesModal')
const AppError = require('../utils/appErrorClass')
const catchAsync = require('../utils/catchAsync')
const factory = require('../utils/handlerFactory')

// eslint-disable-next-line no-unused-vars
exports.getAllVacancies = catchAsync(async (req, res, next) => {
    const vacancies = (
        await Vacancy.find({}).populate({
            path: 'candidates',
            select: {
                icon: 1,
            },
        })
    ).filter((el) => el.managers.some((item) => item.id === req.user.id))
    factory.sendRequest(res, vacancies, 200)
})

// eslint-disable-next-line no-unused-vars
exports.getVacancyById = catchAsync(async (req, res, next) => {
    const vacancy = await Vacancy.findById(req.params.id).select({
        candidates: 0,
    })

    if (!vacancy) {
        return next(new AppError('No document found with that ID', 404))
    }

    factory.sendRequest(res, vacancy, 200)
})

// eslint-disable-next-line no-unused-vars
exports.createVacancy = catchAsync(async (req, res, next) => {
    const newVacancy = await Vacancy.create({
        ...req.body,
    })
    factory.sendRequest(res, { id: newVacancy.id }, 201)
})

exports.deleteVacancy = factory.deleteOne(Vacancy)

exports.updateVacancy = catchAsync(async (req, res, next) => {
    const body = {
        ...req.body,
    }
    const vacancy = await Vacancy.findByIdAndUpdate(req.params.id, body, {
        new: true,
        runValidators: true,
    })

    if (!vacancy) {
        return next(new AppError('No document found with that ID', 404))
    }

    factory.sendRequest(res, { id: vacancy.id }, 200)
})

exports.getAllVacancyCandidates = catchAsync(async (req, res, next) => {
    const vacancy = await Vacancy.findById(req.params.id).populate({
        path: 'candidates',
        select: {
            _id: 1,
            name: 1,
            id: 1,
            stages: 1,
        },
    })

    if (!vacancy) {
        return next(new AppError('No document found with that ID', 404))
    }

    const candidates = vacancy.candidates.map((el) => {
        return {
            name: el.name,
            id: el.id,
            stages: el.stages
                .map((res) => ({
                    name: res.name,
                    id: res.id,
                    vacancyId: res.vacancyId,
                    scores: res.scores,
                }))
                .filter((res) => res.vacancyId === req.params.id),
        }
    })
    factory.sendRequest(res, candidates, 200)
})

// eslint-disable-next-line no-unused-vars
exports.getHiringTeam = catchAsync(async (req, res, next) => {
    const hiring_manger = await Vacancy.findById(req.params.id).select({
        managers: 1,
    })
    factory.sendRequest(res, hiring_manger.managers, 200)
})

exports.restrictToManager = catchAsync(async (req, res, next) => {
    const vacancy = await Vacancy.findById(req.params.id)
    if (!vacancy.managers.includes(req.user.id)) {
        return next(
            new AppError('You dont have permission to perform this action', 403)
        )
    }
    next()
})
