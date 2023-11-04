const express = require('express')
const notifficationController = require('../controllers/notifficationController')
const { protect } = require('../controllers/authController')

const router = express.Router()

router
    .route('/notiffications')
    .get(protect, notifficationController.getCompanyNotiffications)

router
    .route('/notiffications')
    .post(protect, notifficationController.declineNotiffication)

module.exports = router
