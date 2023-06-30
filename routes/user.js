const express = require('express')
const router = express.Router()
const {authentication} = require('../middlewares/authentication')
const userController = require('../controllers/userController')

router.post('/register', userController.register)

router.post('/login', userController.login)

router.use(authentication)

// router.post('/addOrderServices', userController.addOrderServices)

module.exports = router