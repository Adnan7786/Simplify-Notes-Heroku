const CustomAPIError = require('./custom-api')
const BadRequestError = require('./bad-request')
const NotFoundError = require('./not-found')
const InternalServerError = require('./internal-server')
const UnauthenticatedError = require('./unauthenticated')
const UnauthorizedError = require('./unauthorized')
module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  InternalServerError
}