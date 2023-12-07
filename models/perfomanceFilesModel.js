const mongoose = require('mongoose')

const perfomanceFileSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    data: {
        type: String,
    },
    perfomanceId: {
        type: String,
        require: [true, 'Please provide a id'],
    },
})

const PerfomanceFiles = mongoose.model('perfomanceFiles', perfomanceFileSchema)

module.exports = PerfomanceFiles
