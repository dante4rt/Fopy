const { Order } = require('../models');

const authorization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Order.findByPk(id);

    if (!data) throw { name: 'NOT_FOUND' };

    if (req.user.id !== data.authorId) throw { name: 'FORBIDDEN' };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authorization;
