const express = require('express')
const employeesController = require('../controllers/employeeController')
const { protect } = require('../controllers/authController')

const router = express.Router()

router.get('/', protect, employeesController.getAllEmployees)
router.post('/', protect, employeesController.createEmployee)

router
    .route('/:id')
    .get(protect, employeesController.getEmployeeById)
    .patch(protect, employeesController.updateEmployee)
    .delete(protect, employeesController.deleteEmployee)

module.exports = router
