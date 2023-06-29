const express = require('express')
const AdminController = require('../controllers/adminController');

const adminRouter = express.Router()


adminRouter.post('/login', AdminController.loginAdministrator)

module.exports = adminRouter
