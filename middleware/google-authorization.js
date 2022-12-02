//custom module
const { getCredentials, setCredentials } = require('../utils')
const { UnauthorizedError } = require('../errors')

const authorizeUser = async (req, res, next) => {
  const gr_token = req.user.googleRefreshToken
  if (!gr_token) {
    throw new UnauthorizedError("No access, refresh token, API key or refresh handler callback is set.")
  }

  const tokens = getCredentials()
  if (!tokens.refresh_token || (tokens.refresh_token !== gr_token)) {
    console.log('hurray')
    setCredentials({
      refresh_token: gr_token
    })
  }
  next()
}

module.exports = authorizeUser