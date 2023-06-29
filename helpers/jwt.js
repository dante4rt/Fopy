const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY

const generateToken = (data) => {
    return jwt.sign(data, SECRET_KEY)
}

const validateToken = (token) => {
    return jwt.verify(token, SECRET_KEY)
}

module.exports = { 
    generateToken,
    validateToken
}