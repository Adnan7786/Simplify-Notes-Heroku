//npm module
const express = require('express')

//custom module
const {
  insert
} = require('../controller/insert')

const router = express.Router()

router.route('/:style').post(insert)

module.exports = router