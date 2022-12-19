//npm module
const express = require('express')

//custom module
const {
  getStyles,
  updateStyles
} = require('../controller/style')

const router = express.Router()

router.route('/').get(getStyles)
router.route('/:style').post(updateStyles)

module.exports = router