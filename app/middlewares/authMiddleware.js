const jwt = require('jsonwebtoken')
const config = require('../../config/config')

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], config.jwtSecret)

    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = { authenticate }
