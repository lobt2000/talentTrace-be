const express = require('express')
const authController = require('../controllers/authController')

const router = express.Router()

router.post('/loginByUser', authController.login)
router.post('/signUpCompany', authController.signUpCompany)
router.post('/signUpManager', authController.signUpManager)
router.post('/loginByCompany', authController.loginByCompany)
router.patch('/updateManagerPassword', authController.updateManagerPassword)

module.exports = router
