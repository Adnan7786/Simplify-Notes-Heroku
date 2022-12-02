//custom module
const { isTokenValid } = require('../utils')
const { UnauthenticatedError, UnauthorizedError } = require('../errors')

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token
  if (!token) {
    throw new UnauthenticatedError('Authentication Invalid')
  }

  try {
    const payload = isTokenValid(token)
    req.user = payload
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid')
  }
}

const authorizePermissions = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    throw new UnauthorizedError('Unauthorized to access this route')
  }
  next()
}

module.exports = {
  authenticateUser,
  authorizePermissions
}