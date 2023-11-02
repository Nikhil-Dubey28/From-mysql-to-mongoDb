const express = require('express')
const resetpasswordController = require('../controllers/resetpassController')
const router = express.Router()

router.get('/password/updatepassword/:resetpasswordid',resetpasswordController.updatePassword)
router.get('/password/resetpassword/:id',resetpasswordController.resetPassword)


router.use('/password/forgotpassword', resetpasswordController.forgotPassword)



module.exports =  router