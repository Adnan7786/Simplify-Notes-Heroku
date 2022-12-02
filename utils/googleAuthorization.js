//npm module
const { google } = require('googleapis')

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)

google.options({
  auth: oauth2Client
})

let scopes = [
  'https://www.googleapis.com/auth/drive'
]

const generateAuthUrl = (email) => {
  let url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    login_hint: email,
    scope: scopes,
    prompt: 'consent'
  })
  return url
}

const generateAuthToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

const setCredentials = (tokens) => {
  oauth2Client.setCredentials(tokens)
}

const getCredentials = () => {
  return oauth2Client.credentials
}

module.exports = {
  generateAuthUrl,
  generateAuthToken,
  setCredentials,
  getCredentials
}