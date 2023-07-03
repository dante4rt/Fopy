const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || "Coki-Coki"

const signToken = (data) => {
  return jwt.sign(data, SECRET);
}

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
}

module.exports = { signToken, verifyToken }
