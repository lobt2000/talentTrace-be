// const crypto = require('crypto');
const mongoose = require('mongoose')

const vacancySchema = new mongoose.Schema({
    range: {
        start: {
            type: Date,
            require: [true, 'Please provide start date'],
        },
        end: {
            type: Date,
            require: [true, 'Please provide end date'],
        },
    },
    quota: {
        type: String,
    },
    expirience: {
        type: String,
        require: [true, 'Please provide end date'],
    },
    jobType: {
        id: { type: Number, require: [true, 'Please provide jobType'] },
        name: { type: String, require: [true, 'Please provide jobType'] },
    },
    salary: {
        currency: {
            id: Number,
            name: String,
            icon: String,
        },
        value: String,
    },
    location: String,
    skill: [String],
    name: {
        type: String,
        require: [true, 'Please provide name'],
    },
    description: {
        type: String,
        require: [true, 'Please provide description'],
    },
    aсtive: {
        type: Boolean,
        default: true,
    },
    hiring_manger: {
        type: String,
        require: [true, 'Please provide manager'],
    },
    managers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Vacancy must contain a manager'],
        },
    ],
    id: String,
    // candidates: [{

    // }]
    bgIcon: String,
})

vacancySchema.pre('save', function (next) {
    this.id = this._id
    this.icon = 'assets/img/dev-company-logo.jpeg'
    next()
})

vacancySchema.pre(/^find/, async function (next) {
    this.find({ active: { $ne: false } })

    next()
})

vacancySchema.pre(/^find/, function (next) {
    this.populate({
        path: 'managers',
    })
    next()
})

const Vacancy = mongoose.model('Vacancy', vacancySchema)

module.exports = Vacancy
