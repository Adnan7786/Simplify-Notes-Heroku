//custom module
const { BadRequestError } = require('../errors')

const checkDocID = (req, res, next) => {
  const docID = req.user.currentDocID
  if (!docID) {
    throw new BadRequestError('No currentDocID available')
  }
  next()
}

module.exports = checkDocID