//npm module
const { StatusCodes } = require('http-status-codes')

//custom module
const { BadRequestError, NotFoundError, InternalServerError } = require('../errors')
const { getUserStyle, updateUserStyle } = require('../utils')

const getStyles = async (req, res) => {
  const { userId } = req.user
  const style = await getUserStyle({ _id: userId })
  if (!style) {
    throw new BadRequestError('Styles for requested user not found')
  }
  return res.status(StatusCodes.OK).json(style)
}



const updateStyles = async (req, res) => {
  const { userId } = req.user
  const style = req.params.style

  const allowedStyles = ["heading", "subheading", "paragraph", "bullet"]
  if (!(allowedStyles.includes(style))) {
    throw new NotFoundError("Requested route not found")
  }

  const { backgroundColor, foregroundColor, fontFamily, fontSize, bold, italic, underline, bulletPreset } = req.body

  if (typeof backgroundColor === 'undefined' || typeof foregroundColor === 'undefined' || typeof fontFamily === 'undefined' || typeof fontSize === 'undefined' || typeof bold === 'undefined' || typeof italic === 'undefined' || typeof underline === 'undefined') {
    throw new BadRequestError('Please provide backgroundColor, foregroundColor, fontFamily, fontSize, bold, italic and underline values')
  }

  if (style === 'bullet' && !bulletPreset) {
    throw new BadRequestError('Please provide bulletPreset value')
  }

  const reqObj = await getRequestsJsonObject(userId)
  const styles = reqObj.styles
  styles[style] = req.body

  const result = await updateRequestsJsonFile(userId, reqObj)
  if (!result) {
    throw new InternalServerError('Something went wrong. Please try again later.')
  }

  return res.status(StatusCodes.OK).json({})
}


module.exports = {
  getStyles,
  updateStyles
}