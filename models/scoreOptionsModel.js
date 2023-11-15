const mongoose = require('mongoose')

const scoreOptionsSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    name: {
        type: String,
        require: [true, 'Please provide a name of the stage'],
    },
    type: {
        type: String,
        require: [true, 'Please provide a type of the stage'],
    },
})

scoreOptionsSchema.pre('save', function (next) {
    this.id = this._id
    next()
})

scoreOptionsSchema.pre(/^find/, async function (next) {
    this.find({ active: { $ne: false } })

    next()
})

const ScoreOptions = mongoose.model('scoreOptions', scoreOptionsSchema)

module.exports = ScoreOptions
