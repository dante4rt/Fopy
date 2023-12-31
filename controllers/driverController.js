const { comparePassword } = require('../helpers/bcrypt');
const { generateToken, signToken } = require('../helpers/jwt');
const { Administrator, Order, User } = require('../models');

class driverController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: 'EMAIL_REQUIRED' };
      }
      if (!password) {
        throw { name: 'PASSWORD_REQUIRED' };
      }

      const driver = await Administrator.findOne({
        where: {
          email,
        },
      });

      if (!driver) {
        throw { name: 'INVALID_DATA' };
      }


      const isValidPassword = comparePassword(password, driver.password);

      if (!isValidPassword) {
        throw { name: 'INVALID_DATA' };
      }


      const access_token = signToken({
        id: driver.id,
        email: driver.email,
        // username: driver.username,
      });

      res.json({
        id: driver.id,
        email: driver.email,
        access_token: access_token,
        // username: driver.username,
        // role: driver.role
      });
    } catch (error) {
      next(error);
    }
  }
  static async fetchOrders(req, res, next) {
    try {
      // where status = pending
      const orders = await Order.findAll({
        where: {
          AdministratorId: req.user.id
        }
      })

      res.json(orders)
    } catch (error) {
      next(error);
    }
  }

  static async fetchOrderById(req, res, next) {
    try {
      // where status = pending
      const { id } = req.params
      const orders = await Order.findByPk(id, {
        include: {
          model: User,
          attributes: {
            exclude: ['password']
          }
        }
      });
      
      if (!orders) throw { name: 'NOT_FOUND' }

      if (orders.orderStatus === 'Completed' || orders.orderStatus === 'completed') {
        throw { name: 'ORDER_HAS_BEEN_COMPLETED' }
      }

      res.json(orders)
    } catch (error) {
      console.log(error);
      next(error);
    }
  }


  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const user = req.user.id

      const order = await Order.findByPk(id)

      if (!order) throw { name: 'NOT_FOUND' }
      
      await Order.update({ orderStatus: status, AdministratorId: user }, {
          where: {
              id
          }
      })

      res.status(200).json({ message: 'Order status has been updated!' })
    } catch (error) {
      next(error);
    }
  }
}

module.exports = driverController;
