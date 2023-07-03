const express = require('express')
const router = express.Router()
const {authentication} = require('../middlewares/authentication')
const userController = require('../controllers/userController')
const additionalController = require('../controllers/additionalController')

router.post('/register', userController.register)

router.post('/login', userController.login)

router.post('/midtrans/check', additionalController.midtransCheck)

router.use(authentication)

router.post('/midtrans', additionalController.generateMidtransToken)

// router.post('/addOrderServices', userController.addOrderServices)

module.exports = router