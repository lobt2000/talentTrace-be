const Company = require('../models/companyModel')
const catchAsync = require('../utils/catchAsync')
const factory = require('../utils/handlerFactory')

// eslint-disable-next-line no-unused-vars
exports.getCompanyNotiffications = catchAsync(async (req, res, next) => {
    const company = await Company.findById(req.user.id)
    const dateNotiffication = company.notiffications
    const groupNotifficationsByDate = []
    dateNotiffication.forEach((res) => {
        const filterNotifficationsByDate = dateNotiffication.filter(
            (el) => getDateTime(res.date) === getDateTime(el.date)
        )
        if (
            !groupNotifficationsByDate.some(
                (item) => getDateTime(item.date) === getDateTime(res.date)
            )
        ) {
            groupNotifficationsByDate.push({
                date: res.date,
                notiffications: filterNotifficationsByDate,
            })
        }
    })

    factory.sendRequest(res, groupNotifficationsByDate, 200)
})

// eslint-disable-next-line no-unused-vars
exports.declineNotiffication = catchAsync(async (req, res, next) => {
    const company = await Company.findById(req.user.id)
    company.notiffications = company.notiffications.map((notiffication) =>
        req.body.id == notiffication._id
            ? { active: false, ...notiffication }
            : notiffication
    )

    await company.save({ validateBeforeSave: false })

    res.status(204).json({
        status: 'success',
        data: null,
    })

    factory.sendRequest(res, null, 204)
})

const getDateTime = (time) => {
    return new Date(time).getTime()
}
