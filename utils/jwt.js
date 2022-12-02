const jwt = require('jsonwebtoken')

const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME
  })
  return token
}

const isTokenValid = (token) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET)
  return payload
}

const attachCookiesToResponse = ({ res, user }) => {
  console.log(user)
  const token = createJWT(user)
  const oneDay = 1000 * 60 * 60 * 24
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay * 30),
    secure: process.env.NODE_ENV === 'production',
    signed: true
  })
}


module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse
}