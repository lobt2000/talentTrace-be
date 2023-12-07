// const Company = require('../models/companyModel')
const Employee = require('../models/employeeModel')
const AppError = require('../utils/appErrorClass')
const catchAsync = require('../utils/catchAsync')
const factory = require('../utils/handlerFactory')

// eslint-disable-next-line no-unused-vars
exports.getAllEmployees = catchAsync(async (req, res, next) => {
    const employee = (await Employee.find({})).filter(
        (el) => el.status?.name !== 'Pending'
    )
    factory.sendRequest(res, employee, 200)
})

// eslint-disable-next-line no-unused-vars
exports.getEmployeeById = factory.getOne(Employee, {
    path: 'managers_team',
    select: {
        name: 1,
        id: 1,
        fullPosition: 1,
    },
})

// eslint-disable-next-line no-unused-vars
exports.createEmployee = catchAsync(async (req, res, next) => {
    const newEmployee = await Employee.create({
        ...req.body,
        email: req.body.workEmail,
        companyEmail: req.user.email,
        managers_team: [req.user.id],
    })

    factory.sendRequest(res, { id: newEmployee.id }, 201)
})

exports.deleteEmployee = factory.deleteOne(Employee)

exports.updateEmployee = catchAsync(async (req, res, next) => {
    const body = {
        ...req.body,
        ...(req.body.firstName && {
            name: req.body.firstName + ' ' + req.body.surName,
        }),
        ...(req.body.level && {
            fullPosition: req.body.level.name + ' ' + req.body.position.name,
        }),
    }
    const employee = await Employee.findByIdAndUpdate(req.params.id, body, {
        new: true,
        runValidators: true,
    })

    if (!employee) {
        return next(new AppError('No document found with that ID', 404))
    }

    factory.sendRequest(res, { id: employee.id }, 200)
})
