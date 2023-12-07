const Employee = require('../models/employeeModel')
const PerfomanceFiles = require('../models/perfomanceFilesModel')
const Perfomances = require('../models/perfomanceModel')
// const AppError = require('../utils/appErrorClass')
const catchAsync = require('../utils/catchAsync')
const factory = require('../utils/handlerFactory')

// eslint-disable-next-line no-unused-vars
exports.getAllEmployeePerfomance = catchAsync(async (req, res, next) => {
    let filter
    if (req.params.employeeId) filter = { id: req.params.employeeId }
    const employee = await Employee.findById(filter.id).populate('perfomances')
    factory.sendRequest(res, employee.perfomances, 200)
})

// eslint-disable-next-line no-unused-vars
exports.getPerfomance = catchAsync(async (req, res, next) => {
    const perfomance = await Perfomances.findById(req.params.id)
    factory.sendRequest(res, perfomance, 200)
})

// eslint-disable-next-line no-unused-vars
exports.createEmployeePerfomance = catchAsync(async (req, res, next) => {
    const newPerfomance = await Perfomances.create({
        feedbacks: req.body,
        createdBy: req.user.name,
    })

    let filter
    if (req.params.employeeId) filter = { id: req.params.employeeId }
    if (filter) {
        const newEmployee = await Employee.findById(filter.id)
        if (newEmployee.perfomances.length)
            newEmployee.perfomances.push(newPerfomance.id)
        else newEmployee.perfomances = [newPerfomance.id]
        await newEmployee.save({ validateBeforeSave: false })
    }

    factory.sendRequest(res, { id: newPerfomance._id }, 201)
})

// eslint-disable-next-line no-unused-vars
exports.deletePerfomance = catchAsync(async (req, res, next) => {
    let filter
    if (req.params.employeeId) filter = { id: req.params.employeeId }
    const newEmployee = await Employee.findById(filter.id)
    const perfomance = await Perfomances.findById(req.params.id)
    perfomance.feedbacks.forEach((el) => {
        if ('id' in el.file) {
            PerfomanceFiles.findOneAndDelete({
                id: el.file.id,
            })
        }
    })
    newEmployee.perfomances = newEmployee.perfomances.filter(
        (el) => el !== req.params.id
    )
    await newEmployee.save({ validateBeforeSave: false })
    await perfomance.deleteOne()
    factory.sendRequest(res, perfomance, 200)
})

// eslint-disable-next-line no-unused-vars
exports.uploadPerfomanceFile = catchAsync(async (req, res, next) => {
    const body = JSON.parse(req.body.file)
    await PerfomanceFiles.create({
        ...body,
    })
    factory.sendRequest(res, {}, 201)
})
