// const crypto = require('crypto');
const mongooses = require('mongoose')
const validators = require('validator')

const employeeSchema = new mongooses.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide name'],
    },
    surName: {
        type: String,
        required: [true, 'Please provide Surname'],
    },
    email: {
        type: String,
        require: [true, 'Please provide email'],
        unique: true,
        lowercase: true,
        validate: [validators.isEmail, 'Invalid Email'],
    },
    startDate: {
        type: Date,
    },
    department: {
        id: Number,
        name: String,
    },
    projectName: String,
    unit: {
        id: Number,
        name: String,
    },
    hr: String,
    position: {
        department: {
            name: String,
            id: Number,
        },
        qualificationLevelRequired: Boolean,
        requiresTechStack: Boolean,
        name: String,
        id: Number,
    },
    country: {
        id: Number,
        name: String,
    },
    city: String,
    phoneNumber: String,
    workEmail: {
        type: String,
        require: [true, 'Please provide email'],
        unique: true,
        lowercase: true,
        validate: [validators.isEmail, 'Invalid Email'],
    },
    status: {
        id: Number,
        name: String,
    },
    employmentType: {
        id: Number,
        name: String,
    },
    level: {
        id: Number,
        name: String,
    },
    subDepartment: {
        id: Number,
        name: String,
    },
    companyEmail: {
        type: String,
        require: [true, 'Please provide email'],
        lowercase: true,
        validate: [validators.isEmail, 'Invalid Email'],
    },
    name: String,
    fullPosition: String,
    id: String,
    icon: String,
    managers_team: [
        {
            type: mongooses.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Vacancy must contain a manager'],
        },
    ],

    perfomances: [
        {
            type: mongooses.Schema.ObjectId,
            ref: 'Perfomance',
        },
    ],
})

employeeSchema.pre('save', function (next) {
    this.name = this.firstName + ' ' + this.surName
    this.fullPosition = this.level.name + ' ' + this.position.name
    this.id = this._id
    this.icon = 'assets/img/dev-company-logo.jpeg'
    next()
})

employeeSchema.pre(/^find/, async function (next) {
    this.find({ active: { $ne: false } })

    next()
})

const Employee = mongooses.model('Employee', employeeSchema)

module.exports = Employee
