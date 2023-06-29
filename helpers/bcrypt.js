const bcrypt = require('bcryptjs')

function hashPassword(password) {

  const salt = bcrypt.genSaltSync(8);

  const hash = bcrypt.hashSync(password, salt);
  return hash
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash); // true
}

module.exports = { hashPassword, comparePassword }