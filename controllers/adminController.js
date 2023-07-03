const { Administrator, Order, OrderDetail, Service, User } = require('../models');
const { comparePassword } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')
const sequelize = require('sequelize');
const { Op } = require("sequelize");
module.exports = class AdminController {
  static async loginAdministrator(req, res, next) {
    try {
      const { email, password } = req.body
      console.log(req.body)

      if (!email) throw { name: "Email is required" }
      if (!password) throw { name: "Password is required" }
      const findEmail = await Administrator.findOne({
        where: {
          email
        }
      })
      console.log(findEmail, "<<<<<")
      if (!findEmail) throw { name: "Invalid email/password" }
      let comparingPassword = comparePassword(password, findEmail.password)
      if (!comparingPassword) throw { name: "Invalid email/password" }
      const access_token = signToken({
        id: findEmail.id,
        email: findEmail.email
      })
      res.status(201).json({
        access_token,
        id: findEmail.id,
        email: findEmail.email,
        mitraName: findEmail.mitraName,
        role: findEmail.role,
        AdministratorId: findEmail.AdministratorId
      })
    } catch (error) {
      console.log(error, "<<<<errrorr dari sini")
      next(error)
    }
  }

  static async registerMitra(req, res, next) {
    try {
      let { mitraName, email, password, balance, status, location } = req.body
      location = JSON.parse("[" + location + "]");
      // console.log(location, `<<<<`);
      const createNewMitra = await Administrator.create({
        mitraName,
        email,
        password,
        role: req.admin.role === 'admin' ? 'mitra' : 'driver',
        balance,
        status: "active",
        location: {
          type: "Point",
          coordinates: location
        },
        AdministratorId: req.admin.role === 'admin' ? null : req.admin.id,
        // jika yang ngeadd = admin, maka adminId ga perlu
        // jika yang request = mitra (buat ngeadd driver dia sendiri), maka AdminId = si Id adminnya wicis req.admin.id
      })
      res.status(201).json({
        mitraName: createNewMitra.mitraName,
        email: createNewMitra.email,
        role: createNewMitra.role,
        balance: createNewMitra.balance,
        status: createNewMitra.status,
        location: createNewMitra.location,
        AdministratorId: createNewMitra.AdministratorId
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  static async readAllServices(req, res, next) {
    try {
      const getServices = await Service.findAll()
      res.status(200).json(getServices)
      // console.log(getServices);
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  static async readAllMitra(req, res, next) {
    try {
      let getAllMitra;
      if (req.admin.role === 'admin') {
        getAllMitra = await Administrator.findAll({
          where: {
            role: "mitra"
          }
        });
      } else if (req.admin.role === 'mitra') {
        getAllMitra = await Administrator.findAll({
          where: {
            AdministratorId: req.admin.id,
            role: "driver"
          }
        });
      } else {
        throw { name: "NOT_FOUND" };
      }
      if (!req.headers.access_token) {
        throw { name: "Invalid token" };
      }

      console.log(getAllMitra);
      res.status(200).json(getAllMitra);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async addServices(req, res, next) {
    try {
      const { name, price, description, imgUrl, type } = req.body
      const createServices = await Service.create({
        AdministratorId: req.admin.id,
        name,
        price,
        description,
        imgUrl,
        type
      })
      console.log(createServices, "<<<")
      res.status(201).json(createServices)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  static async updateOrders(req, res, next) {
    console.log("masukkkkksjshidhdhud");
    const id = +req.params.id
    console.log(id, "masukk");
    try {
      const data = await Order.findByPk(id)
      console.log(data, "data auth")
      if (!data) throw { name: 'NOT_FOUND' }

      if (req.admin.id !== data.AdministratorId) throw { name: 'FORBIDDEN' }

      const { orderStatus } = req.body
      const updateTheProduct = await Order.update(
        { orderStatus }, {
        where: {
          id,
        }
      })
      console.log(updateTheProduct);
      res.status(200).json({ message: `updated status success from ${orderStatus} on id ${updateTheProduct}` })
    } catch (error) {
      console.log(error);
      next(error)
    }
  }

  static async getOrdersByMitra(req, res, next) {
    const id = req.admin.id
    try {
      const getOrdersBymitra = await Order.findAll({
        where: {
          AdministratorId: id
        }
      })
      res.status(200).json(getOrdersBymitra)
    } catch (error) {
      console.log(error);
      next(error)
    }
  }

  static async editServices(req, res, next) {
    const id = +req.params.id;
    try {
      const data = await Service.findByPk(id)
      console.log(data, "data auth")
      if (!data) throw { name: 'NOT_FOUND' }

      if (req.admin.id !== data.AdministratorId) throw { name: 'FORBIDDEN' }
      const { AdministratorId, name, price, description, imgUrl, type } = req.body;
      const editServices = await Service.update(
        {
          AdministratorId, name, price, description, imgUrl, type
        },
        {
          where: {
            id
          }
        }
      );
      res.status(200).json({ message: "Edit services success!" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getServicesByMitra(req, res, next) {
    const id = req.admin.id
    try {
      const findServicesByMitra = await Service.findAll({
        where: {
          AdministratorId: id,
        },
      })
      console.log(findServicesByMitra, "<<<");
      res.status(200).json(findServicesByMitra)
    } catch (error) {
      console.log(error)
    }
  }

  static async deleteMitraOrDriver(req, res, next) {
    const id = +req.params.id;
    try {
      const data = await Administrator.findByPk(id);
      console.log(data, "data auth");
      if (!data) throw { name: 'NOT_FOUND' };

      if (req.admin.id === data.AdministratorId || data.AdministratorId === null) {
        await data.destroy();
        res.status(200).json({ msg: `${data.mitraName} successfully deleted` });
      } else {
        throw { name: 'FORBIDDEN' };
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async totalBalance(req, res, next) {
    try {
      let whereCondition = {
        [Op.or]: [
          { AdministratorId: req.admin.id },
          { AdministratorId: null }
        ]
      };

      const totalBalance = await Administrator.findOne({
        attributes: [
          [sequelize.fn('sum', sequelize.col('balance')), 'totalBalance']
        ],
        where: whereCondition,
      });

      console.log(totalBalance, "<<<<<<");
      res.status(200).json(totalBalance);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }



}