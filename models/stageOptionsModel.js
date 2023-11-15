const mongoose = require('mongoose')

const stageOptionsSchema = new mongoose.Schema({
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

stageOptionsSchema.pre('save', function (next) {
    this.id = this._id
    next()
})

stageOptionsSchema.pre(/^find/, async function (next) {
    this.find({ active: { $ne: false } })

    next()
})

const StageOptions = mongoose.model('stageOptions', stageOptionsSchema)

module.exports = StageOptions
