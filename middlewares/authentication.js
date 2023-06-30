const { signToken, verifyToken } = require('../helpers/jwt')
const { Administrator } = require('../models')

const authenticationAdmin = async (req, res, next) => {
  try {
    const { access_token } = req.headers
    if (!access_token) {
      {
        throw { name: 'Invalid token' }
      }
    }
    else {
      const codeToken = verifyToken(access_token)
      const checkAdminInDatabase = await Administrator.findOne({
        where: {
          email: codeToken.email
        }
      })
      if (!checkAdminInDatabase) {
        {
          throw { name: "Invalid token" }
        }
      }
      else {
        req.admin = checkAdminInDatabase
        next()
      }
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}



const authentication = async (req, res, next) => {
  try {
    const { access_token, role } = req.headers;

    if (!access_token) throw { name: 'INVALID_TOKEN' };


    const decode = verifyToken(access_token, SECRET);

    const user = await Administrator.findByPk(decode.id);

    if (!user) throw { name: 'INVALID_TOKEN' };


    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { authentication, authenticationAdmin };
