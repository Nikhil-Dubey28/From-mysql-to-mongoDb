const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()
const authenticate = require('../middleware/authenticate')



router.get('/users/getuser',userController.getUser)


//signup
router.post('/users/signup', userController.createUser)



//login
router.post('/users/login',userController.login)





module.exports = router