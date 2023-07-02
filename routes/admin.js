const express = require('express')
const AdminController = require('../controllers/adminController');
const { authenticationAdmin } = require('../middlewares/authentication');
const { authorizationForRole } = require('../middlewares/authorization');


const adminRouter = express.Router()

adminRouter.post('/login', AdminController.loginAdministrator)
adminRouter.use(authenticationAdmin)
adminRouter.post('/register', AdminController.registerMitra)
adminRouter.get('/services', authorizationForRole, AdminController.readAllServices) //AuthorizarationForRole
adminRouter.get('/mitras', authorizationForRole, AdminController.readAllMitra) //AuthorizationForRole
adminRouter.get('/revenues', authorizationForRole, AdminController.readAllRevenues) //AuthorizationForRole
adminRouter.post('/services', AdminController.addServices)
adminRouter.patch('/orderstatus/:id', AdminController.updateOrders)
adminRouter.get('/mitraorder', AdminController.getOrdersByMitra)
adminRouter.put('/editservices/:id', AdminController.editServices)
adminRouter.get('/services/mitra', AdminController.getServicesByMitra)
module.exports = adminRouter