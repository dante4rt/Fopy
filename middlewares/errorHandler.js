const errorHandler = (error, req, res, next) => {
  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    res.status(400).json({
      message: error.errors[0].message,
    });
  } else if (error.name === 'Email is required') {
    res.status(400).json({ message: 'Email is required' });
  } else if (error.name === 'Password is required') {
    res.status(400).json({ message: 'Password is required' });
  } else if (error.name === 'Invalid email/password') {
    res.status(401).json({ message: 'Invalid email/password' });
  } else if (error.name === 'Invalid token') {
    res.status(401).json({ message: 'Invalid token' });
  } else if (
    error.name === 'SequelizeUniqueConstraintError' ||
    error.name === 'SequelizeValidationError'
  ) {
    res.status(400).json({ message: error.errors[0].message });
  } else if (error.name === 'EMAIL_REQUIRED') {
    res.status(400).json({ message: 'Email is required' });
  } else if (error.name === 'PASSWORD_REQUIRED') {
    res.status(400).json({ message: 'Password is required' });
  } else if (error.name === 'INVALID_DATA') {
    res.status(401).json({ message: 'Invalid email or password' });
  } else if (error.name === 'NOT_FOUND') {
    res.status(404).json({ message: 'Entity not found!' });
  } else if (
    error.name === 'INVALID_TOKEN' ||
    error.name === 'JsonWebTokenError'
  ) {
    res.status(401).json({ message: 'Invalid token' });
  } else if (error.name === 'FORBIDDEN') {
    res.status(403).json({ message: 'You are not authorized' });
  } else if (error.name === 'PAYMENT_UNSUCCESSFULLY') {
    res.status(400).json({ message: 'Payment failed!' })
  } else if (error.name === 'INSUFFICIENT_BALANCE') {
    res.status(400).json({ message: 'Insufficient balance!' })
  } else if (error.name === 'AMOUNT_MUST_BE_FILLED') {
    res.status(400).json({ message: 'Amount cannot be empty' })
  } else if (error.name === 'EMPTY_FIELD') {
    res.status(400).json({ message: 'Data must be filled!' })
  }
  else {
    res.status(500).json({ message: "Internal Server Error" })
  }
}



module.exports = errorHandler;