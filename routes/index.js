const express = require('express')
const router = express.Router()
const driverRoute = require('./driver')

router.use('/driver', driverRoute)

module.exports = router