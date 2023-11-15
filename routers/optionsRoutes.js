const express = require('express')
const optionController = require('../controllers/optionsController')
const { protect } = require('../controllers/authController')

const router = express.Router()

router
    .get('/score', protect, optionController.getAllScoreOptions)
    .post('/score', protect, optionController.createScoreOption)

router
    .get('/stage', protect, optionController.getAllStageOptions)
    .post('/stage', protect, optionController.createStageOption)

router.route('/score/:id').delete(protect, optionController.deleteScoreOption)
router.route('/stage/:id').delete(protect, optionController.deleteScoreOption)

module.exports = router
