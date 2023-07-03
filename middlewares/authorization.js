const { Order, Service } = require('../models');

const authorization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Order.findByPk(id);

    if (!data) throw { name: 'NOT_FOUND' };

    if (req.user.id !== data.AdministratorId) throw { name: 'FORBIDDEN' };

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const authorizationForRole = async (req, res, next) => {
  try {
    if (req.admin.role === 'admin') {
      next()
    } 
  } catch (error) {
    next(error)
  }

}



module.exports = { authorization, authorizationForRole };
