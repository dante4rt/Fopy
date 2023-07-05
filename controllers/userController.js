const {
  Administrator,
  Order,
  OrderDetail,
  Service,
  User, Topup
} = require('../models');
const bcrypt = require('bcryptjs');
const { signToken } = require('../helpers/jwt');
const { hashPassword, comparePassword } = require('../helpers/bcrypt');
const { sequelize } = require('../models');

class userController {
  /*Create Section*/

  // Register (Table User)
  static async register(req, res, next) {
    try {
      const { username, email, password, imgUrl } = req.body;

      if (!username) {
        res.status(400).json({ message: 'Username cannot be empty' });
        return;
      }

      if (!email) {
        res.status(400).json({ message: 'Email cannot be empty' });
        return;
      }

      if (!password) {
        res.status(400).json({ message: 'Password cannot be empty' });
        return;
      }

      const newUser = await User.create({
        username,
        email,
        password,
        balance: 0,
        imgUrl,
      });

      res.status(201).json({
        message: `User with username ${newUser.username} has been created`,
      });
    } catch (error) {
      next(error);
    }
  }

  // Login
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // check, is there email and password inputed ?
      if (!email) {
        res.status(400).json({ message: 'Please enter your email' });
        return;
      }
      if (!password) {
        res.status(400).json({ message: 'Please enter your password' });
        return;
      }

      // check, is there an email in our server with the one we just inputed ?
      const [user] = await User.findAll({ where: { email: email } });
      if (!user) {
        res.status(404).json({ message: 'Email or Password is incorrect' });
        return;
      }

      // perform comparison with email's password from server with the one we just inputed !
      const isPassValid = bcrypt.compareSync(password, user.password);

      if (!isPassValid) {
        res.status(401).json({ message: 'Email or Password is incorrect' });
        return;
      }

      // if email's password from server match with the password we just inputed then perform hashing the token
      const access_token = signToken({
        id: user.id,
        email: user.email,
        username: user.username,
      });

      // after hashing the token we send it to headers browser
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }

  // Membuat Orderan (Table Orders)
  static async newOrder(req, res, next) {
    const t = await sequelize.transaction(); // Start a transaction

    try {
      const { order, products } = req.body;

      const incomingOrder = await Order.create(
        {
          UserId: req.user.id,
          AdministratorId: order.AdministratorId,
          totalPrice: 0,
          orderStatus: 'Pending',
          orderDate: new Date(),
          location: sequelize.fn('ST_GeomFromText', order.location),
          deliveryMethod: order.deliveryMethod,
        },
        { transaction: t } // Pass the transaction to the create method
      );

      let totalPrice = 0;

      for (const product of products) {
        const service = await Service.findByPk(product.ServiceId);
        const productTotalPrice = service.price * product.totalPage;
        totalPrice += productTotalPrice;
        await OrderDetail.create(
          {
            ServiceId: product.ServiceId,
            OrderId: incomingOrder.id,
            quantity: product.quantity,
            totalPage: product.totalPage,
            url: product.url,
          },
          { transaction: t } // Pass the transaction to the create method
        );
      }

      await incomingOrder.update({ totalPrice }, { transaction: t }); // Update the totalPrice in the order

      // Deduct the totalPrice from the user's balance
      const user = await User.findByPk(req.user.id);

      if (user.balance < totalPrice) {
        await incomingOrder.destroy({ transaction: t }); // Delete the incomingOrder if the balance is insufficient
        throw { name: 'INSUFFICIENT_BALANCE' };
      }

      user.balance -= totalPrice;
      await user.save({ transaction: t });

      // Add the totalPrice to the administrator's balance
      const administrator = await Administrator.findByPk(order.AdministratorId);
      administrator.balance += totalPrice;
      await administrator.save({ transaction: t });

      await t.commit(); // Commit the transaction

      res.status(201).json({
        message: `Order by user id ${incomingOrder.UserId} has been created`,
      });
    } catch (error) {
      await t.rollback(); // Rollback the transaction if an error occurred
      next(error); // Send error message to the client
    }
  }

  /*Update Section*/

  // Melakukan update profile user
  static async updateUser(req, res, next) {
    try {
      const { username, email, password, balance, imgUrl } = req.body;

      if (!username) {
        res.status(400).json({ message: 'username cannot be empty' });
        return;
      }

      if (!email) {
        res.status(400).json({ message: 'email cannot be empty' });
        return;
      }

      if (!password) {
        res.status(400).json({ message: 'password cannot be empty' });
        return;
      }

      if (!imgUrl) {
        res.status(400).json({ message: 'Image cannot be empty' });
        return;
      }

      const response = await User.update(
        {
          username: username,
          email: email,
          password: password,
          balance: balance,
          imgUrl: imgUrl,
        },
        { where: { id: req.user.id } }
      );

      res.status(201).json({
        message: `Data with username ${response.username} has been updated`,
      });
    } catch (error) {
      next(error);
    }
  }

  /*Read Section*/

  // Membaca profile User (Tabel User)
  static async getUser(req, res, next) {
    try {
      const response = await User.findOne({
        where: { id: req.user.id },
        attributes: { exclude: ['password'] },
        include: {
          model: Topup,
          where: {
            status: 'Completed'
          }
        }
      });

      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // Membaca orderan yang udah ada (Tabel Order)
  static async getOrder(req, res, next) {
    try {
      const response = await Order.findAll({ where: { UserId: req.user.id } });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Membaca semua mitra
  static async getAllMitra(req, res, next) {
    try {
      const response = await Administrator.findAll({
        where: { status: 'active', role: 'mitra' },
        attributes: { exclude: ['email', 'password', 'balance'] },
      });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Dapetin semua type = service
  static async getAllService(req, res, next) {
    try {
      const id = req.params.id;
      const response = await Administrator.findAll({
        where: { id: id, status: 'active', role: 'mitra' },
        include: [
          {
            model: Service,
            where: { type: 'service' },
            required: true,
          },
        ],
        attributes: { exclude: ['email', 'password', 'balance'] },
      });

      if (response.length === 0) throw { name: 'NOT_FOUND' };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Dapetin semua type = product
  static async getAllProduct(req, res, next) {
    try {
      const id = req.params.id;
      const response = await Administrator.findAll({
        where: { id: id, status: 'active', role: 'mitra' },
        include: [
          {
            model: Service,
            where: { type: 'product' },
            required: true,
          },
        ],
        attributes: { exclude: ['email', 'password', 'balance'] },
      });

      if (response.length === 0) throw { name: 'NOT_FOUND' };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Membaca mitra apa aja yang tersedia
  static async getMitraByUser(req, res, next) {
    try {
      const id = req.params.id;
      const response = await Administrator.findAll({
        where: { id: id, status: 'active', role: 'mitra' },
        include: [Service],
        attributes: { exclude: ['email', 'password', 'balance'] },
      });

      if (response.length === 0) throw { name: 'NOT_FOUND' };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Membaca History Orderan Yang Berstatus Completed
  static async getHistory(req, res, next) {
    try {
      const response = await Order.findAll({
        where: { UserId: req.user.id, orderStatus: 'Completed' },
        include: [OrderDetail],
      });

      if (response.length === 0) throw { name: 'NOT_FOUND' };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = userController;
