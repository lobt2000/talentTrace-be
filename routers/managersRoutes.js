const express = require('express')
const usersController = require('../controllers/usersController')
const { protect } = require('../controllers/authController')

const router = express.Router()

router.get('/', protect, usersController.getAllManagers)
router.post('/', protect, usersController.createManager)

router
    .route('/:id')
    .get(protect, usersController.getManagerById)
    .patch(protect, usersController.updateManager)
    .delete(protect, usersController.deleteManager)

module.exports = router
