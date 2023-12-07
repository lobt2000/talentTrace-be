const express = require('express')
const { protect } = require('../controllers/authController')
const perfomancesController = require('../controllers/perfomanceController')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: { fieldSize: 25 * 10024 * 1024 },
})
const router = express.Router({ mergeParams: true })

router.get('/', protect, perfomancesController.getAllEmployeePerfomance)
router.post('/', protect, perfomancesController.createEmployeePerfomance)

router
    .route('/:id')
    .get(protect, perfomancesController.getPerfomance)
    //     .patch(protect, perfomancesController.updateEmployee)
    .delete(protect, perfomancesController.deletePerfomance)

router
    .route('/files')
    .get()
    .post(upload.any(), perfomancesController.uploadPerfomanceFile)

module.exports = router
