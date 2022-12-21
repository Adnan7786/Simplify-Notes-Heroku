//npm module
const { StatusCodes } = require('http-status-codes')

//custom module
const { BadRequestError, NotFoundError, InternalServerError } = require('../errors')
const { getUserStyle, updateUserStyle } = require('../utils')


const defaultStyle = {
  "heading": {
    "backgroundColor": {
      "red": 1,
      "blue": 1,
      "green": 1
    },
    "foregroundColor": {
      "red": 0,
      "blue": 0,
      "green": 0
    },
    "fontFamily": "Roboto",
    "fontSize": 26,
    "bold": false,
    "italic": false,
    "underline": false
  },
  "subheading": {
    "backgroundColor": {
      "red": 1,
      "blue": 1,
      "green": 1
    },
    "foregroundColor": {
      "red": 0.4,
      "blue": 0.4,
      "green": 0.4
    },
    "fontFamily": "Roboto",
    "fontSize": 15,
    "bold": false,
    "italic": false,
    "underline": false
  },
  "bullet": {
    "backgroundColor": {
      "red": 1,
      "blue": 1,
      "green": 1
    },
    "foregroundColor": {
      "red": 0,
      "blue": 0,
      "green": 0
    },
    "fontFamily": "Roboto",
    "fontSize": 11,
    "bold": false,
    "italic": false,
    "underline": false
  },
  "paragraph": {
    "backgroundColor": {
      "red": 1,
      "blue": 1,
      "green": 1
    },
    "foregroundColor": {
      "red": 0,
      "blue": 0,
      "green": 0
    },
    "fontFamily": "Roboto",
    "fontSize": 11,
    "bold": false,
    "italic": false,
    "underline": false
  },
  "bulletPreset": "BULLET_DISC_CIRCLE_SQUARE"
}

const getStyles = async (req, res) => {
  const { userId } = req.user
  const style = await getUserStyle({ user: userId })
  if (!style) {
    throw new BadRequestError('Styles for requested user not found')
  }
  return res.status(StatusCodes.OK).json(style)
}



const updateStyle = async (req, res) => {
  const { userId } = req.user
  const style = req.params.style

  const allowedStyles = ["heading", "subheading", "paragraph", "bullet"]
  if (!(allowedStyles.includes(style))) {
    throw new NotFoundError("Requested route not found")
  }

  const { backgroundColor, foregroundColor, fontFamily, bold, italic, underline, bulletPreset } = req.body

  if (typeof backgroundColor === 'undefined' || typeof foregroundColor === 'undefined' || typeof fontFamily === 'undefined' || typeof bold === 'undefined' || typeof italic === 'undefined' || typeof underline === 'undefined') {
    throw new BadRequestError('Please provide backgroundColor, foregroundColor, fontFamily, fontSize, bold, italic and underline values')
  }

  if (typeof backgroundColor.red === 'undefined' || typeof backgroundColor.blue === 'undefined' || typeof backgroundColor.green === 'undefined' || typeof foregroundColor.red === 'undefined' || typeof foregroundColor.blue === 'undefined' || typeof foregroundColor.green === 'undefined') {
    throw new BadRequestError('Please provide backgroundColor.red, backgroundColor.blue, backgroundColor.green, foregroundColor.red, foregroundColor.blue, foregroundColor.green values')
  }

  if (style === 'bullet' && !bulletPreset) {
    throw new BadRequestError('Please provide bulletPreset value')
  }

  const userStyle = await getUserStyle({ user: userId })
  userStyle[style] = {
    foregroundColor,
    backgroundColor,
    bold,
    italic,
    underline,
    fontFamily
  }
  if (style === 'bullet') userStyle['bulletPreset'] = bulletPreset
  const newStyle = await userStyle.save()
  if (!newStyle) {
    throw new InternalServerError('Something went wrong. Please try again later.')
  }
  return res.status(StatusCodes.OK).json(newStyle)
}


const resetStyle = async (req, res) => {
  const { userId } = req.user
  const style = req.params.style

  const allowedStyles = ["heading", "subheading", "paragraph", "bullet"]
  if (!(allowedStyles.includes(style))) {
    throw new NotFoundError("Requested route not found")
  }

  const userStyle = await getUserStyle({ user: userId })
  userStyle[style] = defaultStyle[style]
  if (style === 'bullet') userStyle['bulletPreset'] = defaultStyle['bulletPreset']
  const newStyle = await userStyle.save()
  if (!newStyle) {
    throw new InternalServerError('Something went wrong. Please try again later.')
  }
  return res.status(StatusCodes.OK).json(newStyle)
}

module.exports = {
  getStyles,
  updateStyle,
  resetStyle
}