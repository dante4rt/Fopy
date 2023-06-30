const express = require('express')
const AdminController = require('../controllers/adminController');
const { authenticationAdmin } = require('../middlewares/authentication');

const adminRouter = express.Router()

adminRouter.post('/login', AdminController.loginAdministrator)
adminRouter.use(authenticationAdmin)
adminRouter.post('/register', AdminController.registerMitra)
adminRouter.get('/services', AdminController.readAllServices)
module.exports = adminRouter