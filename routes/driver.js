const express = require('express');
const driverController = require('../controllers/driverController');
const { authentication } = require('../middlewares/authentication');
const {authorization} = require('../middlewares/authorization');
const router = express.Router();

router.post('/login', driverController.login);

router.use(authentication);

router.get('/orders', driverController.fetchOrders);
router.get('/orders/:id', driverController.fetchOrderById);
router.patch('/orders/:id', authorization, driverController.updateStatus);
module.exports = router;
