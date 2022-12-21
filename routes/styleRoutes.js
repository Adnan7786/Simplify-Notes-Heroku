//npm module
const express = require('express')

//custom module
const {
  getStyles,
  updateStyle,
  resetStyle
} = require('../controller/style')

const router = express.Router()

router.route('/').get(getStyles)
router.route('/:style').post(updateStyle)
router.route('/:style/reset').post(resetStyle)

module.exports = router