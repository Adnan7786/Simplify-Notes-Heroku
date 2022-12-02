//npm module
const express = require('express')

//custom module
const {
  login,
  logout
} = require('../controller/googleAuthentication')

const router = express.Router()

router.post('/login', login)
router.get('/logout', logout)

module.exports = router