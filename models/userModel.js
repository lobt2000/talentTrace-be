// const crypto = require('crypto');
const mongooses = require('mongoose')
const validators = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongooses.Schema({
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
        enum: ['company, user'],
        default: 'user',
    },
})

userSchema.pre(/^find/, async function (next) {
    this.find({ active: { $ne: false } })

    next()
})

userSchema.methods.correctPassword = async function (
    possibleUserPassword,
    userPassword
) {
    return await bcrypt.compare(possibleUserPassword, userPassword)
}

const User = mongooses.model('User', userSchema)

module.exports = User
