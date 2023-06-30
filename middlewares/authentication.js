const { validateToken } = require('../helpers/jwt');
const { Administrator } = require('../models');
const SECRET = process.env.SECRET;

const authentication = async (req, res, next) => {
  try {
    const { access_token, role } = req.headers;

    if (!access_token) throw { name: 'INVALID_TOKEN' };

    // if (role !== 'admin') throw { name: 'INVALID_TOKEN' }

    const decode = validateToken(access_token, SECRET);

    const user = await Administrator.findByPk(decode.id);

    if (!user) throw { name: 'INVALID_TOKEN' };
    // if (user.role !== 'admin') throw { name: 'INVALID_TOKEN' };

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = authentication;
