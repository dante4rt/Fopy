const express = require('express')
const router = express.Router()
const {authenticationUser} = require('../middlewares/authentication')
const userController = require('../controllers/userController')

router.post('/register', userController.register)

router.post('/login', userController.login)

router.use(authenticationUser)

router.get('/getUser', userController.getUser)

router.put('/editUser', userController.updateUser)

router.post('/newOrder', userController.newOrder)

router.get('/getOrder', userController.getOrder)

// router.post('/addOrderServices', userController.addOrderServices)

module.exports = router