const express = require('express')
const router = express.Router()
const driverRoute = require('./driver')
const adminRoute = require('./admin')

router.use('/admin', adminRoute)
router.use('/driver', driverRoute)

module.exports = router