const express = require('express')
const authenticate = require('../middleware/authenticate')
const expenseController = require('../controllers/expenseController')
const router = express.Router()

// router.use(authenticate)

// add expense
router.post('/expenses/addexpense', authenticate,expenseController.createExpense)

//get expense
router.get('/expenses/getexpenses',authenticate, expenseController.getExpenses)

router.get('/expenses/download', authenticate, expenseController.downloadExpense)

//paginated expenses
router.get('/expenses/paginated',authenticate,expenseController.paginatedExpenses)

//delete expense
router.delete('/expenses/:id',authenticate,expenseController.deleteExpense)

//edit expense
router.patch('/expenses/edit/:id',authenticate,expenseController.editExpense)

//GET BY ID 
router.get('/expenses/getexpense/:id',authenticate,expenseController.getExpenseById)

module.exports = router