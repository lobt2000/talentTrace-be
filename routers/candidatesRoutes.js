const express = require('express')
const candidateController = require('../controllers/candidateController')
const { protect } = require('../controllers/authController')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: { fieldSize: 25 * 10024 * 1024 },
})

const router = express.Router()

router.get('/', protect, candidateController.getAllCandidates)
router.post('/', upload.any(), candidateController.createCandidate)

router
    .route('/:id')
    .get(protect, candidateController.getCandidateById)
    .patch(upload.any(), candidateController.updateCandidate)
    .delete(protect, candidateController.deleteCandidate)

module.exports = router
