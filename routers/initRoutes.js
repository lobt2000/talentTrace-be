const express = require('express')
const usersController = require('../controllers/usersController')
const { protect } = require('../controllers/authController')

const router = express.Router()

router.get('/', protect, usersController.getInitUserInfo)

module.exports = router
