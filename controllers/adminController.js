const {
  Administrator,
  Order,
  OrderDetail,
  Service,
  User,
  Sequelize,
} = require('../models');
const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const sequelize = require('sequelize');
const { Op } = require('sequelize');
module.exports = class AdminController {
  static async loginAdministrator(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) throw { name: 'Email is required' };
      if (!password) throw { name: 'Password is required' };
      const findEmail = await Administrator.findOne({
        where: {
          email,
        },
      });
      if (!findEmail) throw { name: 'Invalid email/password' };
      let comparingPassword = comparePassword(password, findEmail.password);
      if (!comparingPassword) throw { name: 'Invalid email/password' };
      const access_token = signToken({
        id: findEmail.id,
        email: findEmail.email,
      });
      res.status(201).json({
        access_token,
        id: findEmail.id,
        email: findEmail.email,
        mitraName: findEmail.mitraName,
        role: findEmail.role,
        AdministratorId: findEmail.AdministratorId,
      });
    } catch (error) {
      next(error);
    }
  }

  static async registerMitra(req, res, next) {
    try {
      const { mitraName, email, password, role, balance, status, location } =
        req.body;
      const splitLongLat = location.split(',');
      const getLoc = `POINT(${splitLongLat[1]} ${splitLongLat[0]})`;
      let newLocation = Sequelize.fn('ST_GeomFromText', getLoc);
      const all = await Administrator.findAll();

      const createNewMitra = await Administrator.create({
        mitraName,
        email,
        password,
        role: req.admin.role === 'admin' ? 'mitra' : 'driver',
        balance,
        status: 'active',
        location: newLocation,
        AdministratorId: req.admin.role === 'admin' ? null : req.admin.id,
      });
      res.status(201).json({
        mitraName: createNewMitra.mitraName,
        email: createNewMitra.email,
        role: createNewMitra.role,
        balance: createNewMitra.balance,
        status: createNewMitra.status,
        location: createNewMitra.location,
        AdministratorId: createNewMitra.AdministratorId,
      });
    } catch (error) {
      next(error);
    }
  }

  static async readAllServices(req, res, next) {
    try {
      const getServices = await Service.findAll();
      res.status(200).json(getServices);
    } catch (error) {
      next(error);
    }
  }

  static async readAllMitra(req, res, next) {
    try {
      let getAllMitra;
      if (req.admin.role === 'admin') {
        getAllMitra = await Administrator.findAll({
          where: {
            role: 'mitra',
          },
        });
      } else if (req.admin.role === 'mitra') {
        getAllMitra = await Administrator.findAll({
          where: {
            AdministratorId: req.admin.id,
            role: 'driver',
          },
        });
      } else {
        throw { name: 'NOT_FOUND' };
      }

      res.status(200).json(getAllMitra);
    } catch (error) {
      next(error);
    }
  }

  static async addServices(req, res, next) {
    try {
      const { name, price, description, imgUrl, type } = req.body;
      const createServices = await Service.create({
        AdministratorId: req.admin.id,
        name,
        price,
        description,
        imgUrl,
        type,
      });

      res.status(201).json(createServices);
    } catch (error) {
      next(error);
    }
  }

  static async updateOrders(req, res, next) {
    const id = +req.params.id;

    try {
      const data = await Order.findByPk(id);
      if (!data) throw { name: 'NOT_FOUND' };

      if (req.admin.id !== data.AdministratorId) throw { name: 'FORBIDDEN' };

      const { orderStatus } = req.body;
      const updateTheProduct = await Order.update(
        { orderStatus },
        {
          where: {
            id,
          },
        }
      );

      res
        .status(200)
        .json({
          message: `updated status success from ${orderStatus} on id ${updateTheProduct}`,
        });
    } catch (error) {
      next(error);
    }
  }

  static async getOrdersByMitra(req, res, next) {
    const id = req.admin.id;
    try {
      const getOrdersBymitra = await Order.findAll({
        where: {
          AdministratorId: id,
        },
        include: [
          {
            model: User,
          },
          {
            model: OrderDetail,
            include: {
              model: Service,
            },
          },
        ],
      });
      res.status(200).json(getOrdersBymitra);
    } catch (error) {
      next(error);
    }
  }

  static async editServices(req, res, next) {
    const id = +req.params.id;
    try {
      const data = await Service.findByPk(id);

      if (!data) throw { name: 'NOT_FOUND' };

      if (req.admin.id !== data.AdministratorId) throw { name: 'FORBIDDEN' };
      const { AdministratorId, name, price, description, imgUrl, type } =
        req.body;
      const editServices = await Service.update(
        {
          AdministratorId,
          name,
          price,
          description,
          imgUrl,
          type,
        },
        {
          where: {
            id,
          },
        }
      );
      res.status(200).json({ message: 'Edit services success!' });
    } catch (error) {
      next(error);
    }
  }

  static async getServicesByMitra(req, res, next) {
    const id = req.admin.id;
    try {
      const findServicesByMitra = await Service.findAll({
        where: {
          AdministratorId: id,
        },
      });

      res.status(200).json(findServicesByMitra);
    } catch (error) {
      next(error);
    }
  }

  static async deleteMitraOrDriver(req, res, next) {
    const id = +req.params.id;
    try {
      const data = await Administrator.findByPk(id);
      if (!data) throw { name: 'NOT_FOUND' };

      if (
        req.admin.id === data.AdministratorId ||
        data.AdministratorId === null
      ) {
        await data.destroy();
        res
          .status(200)
          .json({ msg: `Mitra with id ${id} successfully deleted` });
      } else {
        throw { name: 'FORBIDDEN' };
      }
    } catch (error) {
      next(error);
    }
  }

  static async totalBalance(req, res, next) {
    try {
      let whereCondition = {
        [Op.or]: [{ AdministratorId: req.admin.id }, { AdministratorId: null }],
      };

      const totalBalance = await Administrator.findOne({
        attributes: [
          [sequelize.fn('sum', sequelize.col('balance')), 'totalBalance'],
        ],
        where: whereCondition,
      });

      res.status(200).json(totalBalance);
    } catch (error) {
      next(error);
    }
  }
  static async getServicesById(req, res, next) {
    try {
      const id = req.params.id;

      const findServicesByMitra = await Service.findOne({
        where: {
          id,
        },
      });

      res.status(200).json(findServicesByMitra);
    } catch (error) {
      next(error);
    }
  }
};
