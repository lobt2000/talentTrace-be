const express = require('express')
const vacancyController = require('../controllers/vacancyController')
const { protect } = require('../controllers/authController')

const router = express.Router()

router.get('/', protect, vacancyController.getAllVacancies)
router.post('/', protect, vacancyController.createVacancy)

router
    .route('/:id')
    .get(protect, vacancyController.getVacancyById)
    .patch(protect, vacancyController.updateVacancy)
    .delete(protect, vacancyController.deleteVacancy)

router.route('/:id/hiring_team').patch(protect, vacancyController.updateVacancy)
router
    .route('/:id/candidates')
    .get(protect, vacancyController.getAllVacancyCandidates)

module.exports = router
