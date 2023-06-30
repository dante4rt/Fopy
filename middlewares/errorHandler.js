const errorHandler = (err, req, res, next) => {
  if (
    err.name === 'SequelizeUniqueConstraintError' ||
    err.name === 'SequelizeValidationError'
  ) {
    res.status(400).json({ message: err.errors[0].message });
  } else if (err.name === 'EMAIL_REQUIRED') {
    res.status(400).json({ message: 'Email is required' });
  } else if (err.name === 'PASSWORD_REQUIRED') {
    res.status(400).json({ message: 'Password is required' });
  } else if (err.name === 'INVALID_DATA') {
    res.status(401).json({ message: 'Invalid email or password' });
  } else if (err.name === 'NOT_FOUND') {
    res.status(404).json({ message: 'Entity not found!' });
  } else if (err.name === 'INVALID_TOKEN') {
    res.status(404).json({ message: 'Invalid token' });
  } else if (err.name === 'FORBIDDEN') {
    res.status(403).json({ message: 'You are not authorized' });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = errorHandler;
