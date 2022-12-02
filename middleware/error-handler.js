const { StatusCodes } = require('http-status-codes')

const errorHandler = (err, req, res, next) => {
  console.log(err)
  let customError = {
    msg: err.message || 'Something went wrong. Please try again later.',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  }
  if (err.name === 'Validation Error') {
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate values entered for ${Object.keys(err.keyValue)} field, please choose another value`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }
  if (err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }
  if (err.message.startsWith("Invalid token signature:")) {
    customError.msg = 'Invalid token signature'
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandler