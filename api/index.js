//npm modules import
require('dotenv').config()
require('express-async-errors')
const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')

//custom modules import
//database
const connectDB = require('../database/connect')
//middleware
const notFoundMiddleware = require('../middleware/not-found')
const errorHandlerMiddleWare = require('../middleware/error-handler')
const { authenticateUser } = require('../middleware/google-authentication')
const authorizeUser = require('../middleware/google-authorization')
const checkDocID = require('../middleware/checkDocID')

//router
const authRouter = require('../routes/authRoutes')
const googleAuthRouter = require('../routes/googleAuthRoutes')
const userRouter = require('../routes/userRoutes')
const dashboardRoutes = require('../routes/dashboardRoutes')
const insertRouter = require('../routes/insertRoutes')
const googleDocsRouter = require('../routes/googleDocsRoutes')

const app = express()

app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
)
app.use(helmet.contentSecurityPolicy({
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    "script-src": [
      "'self'",
      "https://accounts.google.com/gsi/client",
    ],
    "connect-src": ["'self'", "https://accounts.google.com/gsi/client"],
  },
}))
app.use(cors())
app.use(xss())
app.use(mongoSanitize())
app.use(morgan('tiny')) // log format ':method :url :status :res[content-length] - :response-time ms'
// parse form data
app.use(express.urlencoded({ extended: false })) // parse form data
app.use(express.json()) //parse json
app.use(cookieParser(process.env.JWT_SECRET)) //parse cookies
// app.use(express.static('./public')) //read static assets from ./static folder


//basic app validation route
app.get('/', (req, res) => {
  console.log(req.signedCookies)
  res.json({ msg: 'Simplify Notes' })
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/google-auth', authenticateUser, googleAuthRouter)
app.use('/api/v1/users', authenticateUser, userRouter)
app.use('/api/v1/dashboard', authenticateUser, dashboardRoutes)
app.use('/api/v1/insert', authenticateUser, authorizeUser, checkDocID, insertRouter)
app.use('/api/v1/google-docs', authenticateUser, authorizeUser, checkDocID, googleDocsRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleWare)

const port = process.env.PORT || 3000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start() 