// const crypto = require('crypto');
const mongooses = require('mongoose')
const validators = require('validator')
const bcrypt = require('bcryptjs')
const notifficationConst = require('../constants/notiffications.contant')

const companySchema = new mongooses.Schema({
    firstName: {
        type: String,
    },
    surName: {
        type: String,
    },
    email: {
        type: String,
        require: [true, 'Please provide email'],
        unique: true,
        lowercase: true,
        validate: [validators.isEmail, 'Invalid Email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide us your password'],
        minLength: 8,
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: 'Passwords are not the same',
        },
    },
    passwordChangeDate: Date,
    role: {
        type: String,
        default: 'company',
    },
    notiffications: [
        {
            type: {
                type: Object,
            },
            from: String,
            notifyType: {
                type: String,
                enum: notifficationConst.notifyType,
                default: notifficationConst.notifyType[0],
            },
            notifyText: {
                type: String,
                enum: notifficationConst.notifyText,
                default: notifficationConst.notifyText.acceptionRequest,
            },
            active: {
                type: Boolean,
                default: true,
            },
            date: Date,
            managerId: String,
        },
    ],
})

companySchema.pre('save', async function (next) {
    // Only run this function if pass was modified
    if (!this.isModified('password')) return next()

    // has the pass
    this.password = await bcrypt.hash(this.password, 12)

    this.confirmPassword = undefined
    next()
})

companySchema.pre(/^find/, async function (next) {
    this.find({ active: { $ne: false } })

    next()
})

companySchema.methods.correctPassword = async function (
    possibleUserPassword,
    userPassword
) {
    return await bcrypt.compare(possibleUserPassword, userPassword)
}

const Company = mongooses.model('Company', companySchema)

module.exports = Company
