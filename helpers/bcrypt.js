const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(8);

const hashPassword = (password) => {
  return bcrypt.hashSync(password, salt)
}

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword
}
