const express = require('express')
const authController = require('../controllers/authController')

const router = express.Router()

router.post('/login', authController.login)
router.post('/signUpCompany', authController.signUpCompany)
router.post('/loginByCompany', authController.loginByCompany)

module.exports = router
