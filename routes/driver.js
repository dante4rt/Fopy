const express = require('express')
const driverController = require('../controllers/driverController')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello World Driver!')
  })
router.post('/login', driverController.login)

module.exports = router