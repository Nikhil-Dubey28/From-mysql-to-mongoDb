const express = require('express')
const userController = require('../controller/userController')
const paymentController = require('../controller/paymentController')
const router = express.Router()
const authenticate = require('../middleware/authenticate')



router.post('/checkout', authenticate, paymentController.checkout)

// router.post('/paymentverification', paymentController.paymentVerification)
router.post('/updatetransactionstatus',authenticate, paymentController.updatePayment)




module.exports = router