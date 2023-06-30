const express = require('express')
const router = express.Router()
const userRoute = require('./user')

router.use('/user', userRoute)

module.exports = router
