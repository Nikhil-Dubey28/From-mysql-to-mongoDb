const express = require('express')
const authenticate = require('../middleware/authenticate')
const expenseController = require('../controller/expenseController')
const router = express.Router()

// router.use(authenticate)

// add expense
router.post('/expense/addexpense', authenticate,expenseController.createExpense)

//get expense
router.get('/expense/getexpense',authenticate, expenseController.getExpense)

router.get('/expense/download', authenticate, expenseController.downloadExpense)

//paginated expenses
router.get('/expense/paginated',authenticate,expenseController.paginatedExpense)

//delete expense
router.delete('/expense/:id',authenticate,expenseController.deleteExpense)

//edit expense
router.patch('/expense/edit/:id',authenticate,expenseController.editExpense)

//GET BY ID 
router.get('/expense/getexpense/:id',authenticate,expenseController.getExpenseById)

module.exports = router