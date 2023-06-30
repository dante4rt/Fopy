const express = require('express');
const driverController = require('../controllers/driverController');
const { authentication } = require('../middlewares/authentication');

const router = express.Router();

router.post('/login', driverController.login);

router.use(authentication);

router.get('/orders', driverController.fetchOrders);
router.patch('/orders/:id', driverController.updateStatus);
module.exports = router;