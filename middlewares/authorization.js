const { Order, Service } = require('../models');

const authorization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Order.findByPk(id);

    if (!data) throw { name: 'NOT_FOUND' };

    if (req.user.id !== data.AdministratorId) throw { name: 'FORBIDDEN' };

    next();
  } catch (error) {
    next(error);
  }
};
const authorizationForRole = async (req, res, next) => {
  try {
    if (req.admin.role === 'admin') {
      next()
    } else {
      {
        throw { name: 'FORBIDDEN' }
      }
    }
  } catch (error) {
    next(error)
  }

}



module.exports = { authorization, authorizationForRole };
