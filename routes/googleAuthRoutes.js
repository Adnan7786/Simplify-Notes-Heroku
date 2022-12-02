//npm module
const express = require('express')

//custom module
const {
  generateUrl,
  getToken
} = require('../controller/googleAuthorization')

const router = express.Router()

router.get('/', generateUrl)
router.get('/code', getToken)

module.exports = router