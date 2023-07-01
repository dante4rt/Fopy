const { Administrator, Order, OrderService, Service, User } = require('../models');
const { hashPassword, comparePassword } = require('../helpers/bcrypt')
const { signToken, verifyToken } = require('../helpers/jwt')
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
        username: findEmail.username,
        role: findEmail.role
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  static async registerMitra(req, res, next) {
    try {
      const { mitraName, email, password, role, balance, status, lat, lang } = req.body
      const createNewMitra = await Administrator.create({
        mitraName,
        email,
        password,
        role: "admin",
        balance,
        status,
        lat,
        lang
      })
      res.status(201).json({
        mitraName: createNewMitra.mitraName,
        email: createNewMitra.email,
        role: createNewMitra.role,
        balance: createNewMitra.balance,
        status: createNewMitra.status,
        lat: createNewMitra.lat,
        lang: createNewMitra.lang
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
      console.log(getServices);
    } catch (error) {
      console.log(error)
      next(error)
    }
  }


}