
const { Service, Administrator } = require('../models/')
const authorization = async (req, res, next) => {
  const id = +req.params.id
  try {
    const services = await Service.findByPk(id)
    if (services === null) {
      throw { name: "notFound" }
    }
    //?validasi kepemilikan services
    console.log(req.user.id), "dari author";
    if (req.user.role === 'admin' || req.user.id === services.authorId) {
      next()
    } else {
      throw { name: "Forbidden" }
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
}
const authorizationForRole = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      next()
    } else {
      {
        throw { name: 'Forbidden' }
      }
    }
  } catch (error) {
    next(error)
  }

}
module.exports = { authorization, authorizationForRole }

