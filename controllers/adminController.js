const { Administrator, Order, OrderService, Service, User } = require('../models');
const { hashPassword, comparePassword } = require('../helpers/bcrypt')
const { signToken, verifyToken } = require('../helpers/jwt')
module.exports = class AdminController {
  static async loginAdministrator(req, res, next) {
    try {
      const { email, password } = req.body
      if (!email) throw { name: "Email is required" }
      if (!password) throw { name: "Password is required" }
      const findEmail = await Administrator.findOne({
        where: {
          email
        }
      })
      if (!findEmail) throw { name: "Invalid email/password" }
      const access_token = signToken({
        id: findEmail.id,
        email: findEmail.email
      })
      res.status(200).json({
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

}