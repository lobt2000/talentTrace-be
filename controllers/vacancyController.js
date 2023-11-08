const Vacancy = require('../models/vacanciesModal')
const AppError = require('../utils/appErrorClass')
const catchAsync = require('../utils/catchAsync')
const factory = require('../utils/handlerFactory')

// eslint-disable-next-line no-unused-vars
exports.getAllVacancies = catchAsync(async (req, res, next) => {
    const vacancies = await Vacancy.find({})
    factory.sendRequest(res, vacancies, 200)
})

// eslint-disable-next-line no-unused-vars
exports.getVacancyById = factory.getOne(Vacancy)

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

// exports.updateHiringTeam = catchAsync(async (req, res, next) => {
//     const vacany = await Vacancy.findByIdAndUpdate()
// })
