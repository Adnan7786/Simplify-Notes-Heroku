//npm module
const { StatusCodes } = require('http-status-codes')

//custom module
const { generateAuthUrl, generateAuthToken, attachCookiesToResponse, storeRefreshToken, setCredentials, createTokenUser } = require('../utils')

const generateUrl = (req, res) => {
  let url = generateAuthUrl(req.user.email)
  return res.redirect(url)
}

const getToken = async (req, res) => {
  const code = req.query.code
  const tokens = await generateAuthToken(code)
  setCredentials(tokens)
  const user = await storeRefreshToken(req.user.userId, tokens)
  console.log(user);
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })
  return res.status(StatusCodes.OK).json({})
}


module.exports = {
  generateUrl,
  getToken
}