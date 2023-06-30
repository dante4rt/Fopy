const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET

const generateToken = (data) => {
    return jwt.sign(data, SECRET)
}

const validateToken = (token) => {
    return jwt.verify(token, SECRET)
}

module.exports = { 
    generateToken,
    validateToken
}