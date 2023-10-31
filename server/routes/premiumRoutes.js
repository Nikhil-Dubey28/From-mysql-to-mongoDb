const express = require('express')
const premiumController = require('../controller/premiumController')
const router = express.Router()
const authenticate = require('../middleware/authenticate')


router.get('/premium/showleaderboard' ,authenticate, premiumController.getLeaderboard)

router.post('/premium/dailyreports',authenticate, premiumController.dailyReports)
router.post('/premium/monthlyreports',authenticate, premiumController.monthlyReports)


module.exports = router