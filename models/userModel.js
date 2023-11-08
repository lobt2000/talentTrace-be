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
    companyEmail: {
        type: String,
        require: [true, 'Please provide email'],
        lowercase: true,
        validate: [validators.isEmail, 'Invalid Email'],
    },
    passwordChangeDate: Date,
    role: {
        type: String,
        default: 'manager',
    },
    name: String,
    fullPosition: String,
    id: String,
    icon: String,
    specialization: {
        type: String,
        default: 'manager',
        enum: ['all', 'manager', 'tech', 'soft', 'english'],
    },
})

userSchema.pre('save', function (next) {
    this.name = this.firstName + ' ' + this.surName
    this.fullPosition = this.level.name + ' ' + this.position.name
    this.id = this._id
    this.icon = 'assets/img/dev-company-logo.jpeg'
    next()
})

userSchema.pre('save', async function (next) {
    // Only run this function if pass was modified
    if (!this.isModified('password')) return next()

    // has the pass
    this.password = await bcrypt.hash(this.password, 12)

    this.confirmPassword = undefined
    next()
})

userSchema.pre(/^find/, async function (next) {
    this.find({ active: { $ne: false } })

    next()
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next()

    this.passwordChangedAt = Date.now() - 1000

    next()
})

userSchema.methods.correctPassword = async function (
    possibleUserPassword,
    userPassword
) {
    return await bcrypt.compare(possibleUserPassword, userPassword)
}

userSchema.methods.chengedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        )
        return JWTTimestamp < changedTimestamp
    }

    return false
}

const User = mongooses.model('User', userSchema)

module.exports = User
