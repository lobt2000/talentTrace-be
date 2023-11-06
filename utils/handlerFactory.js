const AppError = require('../utils/appErrorClass')
const catchAsync = require('../utils/catchAsync')

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id)
        if (!doc) {
            return next(new AppError('No document found with that ID', 404))
        }
        res.status(204).json({
            status: 'success',
            data: null,
        })
    })

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        // try {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })

        if (!doc) {
            return next(new AppError('No document found with that ID', 404))
        }
        res.status(200).json({
            status: 'success',
            data: doc,
        })
    })

exports.createOne = (Model) =>
    // eslint-disable-next-line no-unused-vars
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body).then()

        res.status(201).json({
            status: 'success',
            data: doc,
        })
    })

exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id)
        if (popOptions) query = query.populate(popOptions)
        const doc = await query

        if (!doc) {
            return next(new AppError('No document found with that ID', 404))
        }

        res.status(200).json({
            status: 'success',
            data: doc,
        })
    })

// exports.getAll = (Model) =>
//     // eslint-disable-next-line no-unused-vars
//     catchAsync(async (req, res, next) => {
//         // To allow Nested get
//         let filter
//         if (req.params.tourId) filter = { tour: req.params.tourId }
//         // const features = new APIFeatures(Model.find({ filter }), req.query)
//         //     .filter()
//         //     .sort()
//         //     .limitFields()
//         //     .paginate()
//         const features =
//         const doc = await features.query
//         res.status(200).json({
//             status: 'success',
//             results: doc.length,
//             data: doc,
//         })
//     })

exports.sendRequest = (res, data, statusCode) => {
    res.status(statusCode).json({
        status: 'success',
        data,
    })
}
