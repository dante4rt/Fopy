const express = require('express')
const router = express.Router()
const driverRoute = require('./driver')
const adminRoute = require('./admin')
const userRoute = require('./user')


router.use('/admin', adminRoute)
router.use('/driver', driverRoute)
router.use('/user', userRoute)

module.exports = router
