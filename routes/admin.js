const express = require('express')
const AdminController = require('../controllers/adminController');
const { authenticationAdmin } = require('../middlewares/authentication');
const { authorizationForRole } = require('../middlewares/authorization');


const adminRouter = express.Router()

adminRouter.post('/login', AdminController.loginAdministrator)
adminRouter.use(authenticationAdmin)
adminRouter.post('/add/register', AdminController.registerMitra)
adminRouter.get('/services', authorizationForRole, AdminController.readAllServices) //AuthorizarationForRole
adminRouter.get('/mitras', AdminController.readAllMitra) //AuthorizationForRole
adminRouter.post('/add/services', AdminController.addServices)
adminRouter.patch('/orderstatus/:id', AdminController.updateOrders)
adminRouter.get('/mitraorder', AdminController.getOrdersByMitra)
adminRouter.put('/editservices/:id', AdminController.editServices)
adminRouter.get('/services/mitra', AdminController.getServicesByMitra)
adminRouter.delete('/delete/mitra/:id', AdminController.deleteMitraOrDriver)
adminRouter.get('/balance', AdminController.totalBalance)
module.exports = adminRouter