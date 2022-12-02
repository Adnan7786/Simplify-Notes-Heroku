const res = require('express/lib/response')
const { OAuth2Client } = require('google-auth-library')

const verifyCsrfToken = (cookieToken, bodyToken) => {
  let result = {
    successful: false,
    message: 'Something went wrong. Please try again later'
  }

  if (!cookieToken) {
    result.message = 'No CSRF token in cookie'
    return result
  }
  if (!bodyToken) {
    result.message = 'No CSRF token in post body'
    return result
  }
  if (cookieToken !== bodyToken) {
    result.message = 'Failed to verify double submit cookie'
    return result
  }
  result.successful = true
  result.message = 'Successfully verified CSRF Token'
  return result
}

const verifyIdToken = async (token) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,  //CLIENT_ID that accesses the backend, if multiple use array
  });
  const payload = ticket.getPayload();
  return payload
}

module.exports = {
  verifyCsrfToken,
  verifyIdToken
}