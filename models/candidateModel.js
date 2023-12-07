const mongoose = require('mongoose')
const validators = require('validator')

const candidatesSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    firstName: {
        type: String,
        require: [true, 'Please provide a name of the stage'],
    },
    surName: {
        type: String,
        require: [true, 'Please provide a name of the stage'],
    },
    email: {
        type: String,
        require: [true, 'Please provide email'],
        unique: true,
        lowercase: true,
        validate: [validators.isEmail, 'Invalid Email'],
    },

    position: {
        type: String,
        require: [true, 'Please provide a type of the stage'],
    },
    icon: {
        type: Object,
    },
    cv: {
        type: Object,
        require: [true, 'Please provide a type of the stage'],
    },
    vacanciesIds: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Vacancy',
        },
    ],
    stages: [
        {
            type: {
                type: Object,
            },
            name: String,
            id: String,
            file: Object,
            vacancyId: String,
            scores: [
                {
                    id: {
                        type: String,
                    },
                    name: {
                        type: String,
                        require: [true, 'Please provide a name of the score'],
                    },
                    type: {
                        type: String,
                        require: [true, 'Please provide a type of the score'],
                    },
                    value: {
                        type: Number,
                        require: [true, 'Please provide a value of the score'],
                    },
                },
            ],
        },
    ],
    name: String,
    comments: [{}],
})

candidatesSchema.pre('save', function (next) {
    this.id = this._id
    this.name = this.firstName + ' ' + this.surName
    if (!this.icon?.data) this.icon = { data: 'assets/img/images.jpeg' }
    next()
})

candidatesSchema.pre(/^find/, async function (next) {
    this.find({ active: { $ne: false } })

    next()
})

const Candidates = mongoose.model('Candidates', candidatesSchema)

module.exports = Candidates
