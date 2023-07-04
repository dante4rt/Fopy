const express = require('express')
const router = express.Router()
const {authenticationUser} = require('../middlewares/authentication')
const userController = require('../controllers/userController')
const additionalController = require('../controllers/additionalController')

router.post('/register', userController.register)

router.post('/login', userController.login)

router.post('/midtrans/check', additionalController.midtransCheck)

router.use(authenticationUser)

router.get("/getMitraByUser", userController.getAllMitra)

router.get("/getMitraByUser/:id", userController.getMitraByUser)

router.get("/getMitraService/:id", userController.getAllService)

router.get("/getMitraProduct/:id", userController.getAllProduct)

router.get("/getHistory", userController.getHistory)

router.get('/getUser', userController.getUser)

router.put('/editUser', userController.updateUser)

router.post('/newOrder', userController.newOrder)

router.get('/getOrder', userController.getOrder)

// router.post('/midtrans', additionalController.generateMidtransToken)

// router.post('/addOrderServices', userController.addOrderServices)

module.exports = router