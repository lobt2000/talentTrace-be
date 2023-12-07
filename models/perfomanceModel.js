const mongoose = require('mongoose')

const perfomanceSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    feedbacks: [
        {
            id: Number,
            scores: [],
            file: {
                id: String,
            },
            name: String,
            averageLevel: String,
            type: {
                type: String,
            },
        },
    ],
    createdBy: String,
})

perfomanceSchema.pre('save', function (next) {
    this.id = this._id
    next()
})

const Perfomances = mongoose.model('Perfomance', perfomanceSchema)

module.exports = Perfomances
