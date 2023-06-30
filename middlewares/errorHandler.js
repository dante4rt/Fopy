const errorHandler = (error, req, res, next) => {
  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    res.status(400).json({
      message: error.errors[0].message
    })
  }
  else if (error.name === "Email is required") {
    res.status(400).json({ message: "Email is required" })
  }
  else if (error.name === "Password is required") {
    res.status(400).json({ message: "Password is required" })
  }
  else if (error.name === "Invalid email/password") {
    res.status(401).json({ message: "Invalid email/password" })
  }
  else if (error.name === "Invalid token") {
    res.status(401).json({ message: "Invalid token" })
  }
  else {
    res.status(500).json({ message: "Internal server error" })
  }

}

module.exports = errorHandler