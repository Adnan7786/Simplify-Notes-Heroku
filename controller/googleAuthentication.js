//npm module
const { StatusCodes } = require('http-status-codes')

//custom module
const { verifyCsrfToken, verifyIdToken, findUserByGoogleId, updateUser, createUser, createUserFiles,
  createTokenUser, attachCookiesToResponse } = require('../utils')
const CustomError = require('../errors')

const login = async (req, res) => {
  const csrf_token_cookie = req.cookies.g_csrf_token
  const csrf_token_body = req.body.g_csrf_token
  const idToken = req.body.credential

  const result = verifyCsrfToken(csrf_token_cookie, csrf_token_body)
  if (!result.successful) {
    throw new CustomError.BadRequestError(result.message)
  }

  const payload = await verifyIdToken(idToken)

  let user = await findUserByGoogleId(payload.sub)

  if (!user) {
    user = await createUser(payload) //create user if user does not exist
    await createUserFiles(user._id)
  } else {
    user = await updateUser(user, payload) //update existing user if required
  }

  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })

  res.status(StatusCodes.CREATED).json({ user: tokenUser })
}
const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now())
  })
  res.status(StatusCodes.OK).json({})
}

module.exports = {
  login,
  logout
}