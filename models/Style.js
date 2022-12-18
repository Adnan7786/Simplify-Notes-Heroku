//npm module
const mongoose = require('mongoose')
const validator = require('validator')

const colorObj = {
  type: Number,
  min: 0.0,
  max: 1.0
}

const styleObj = {
  backgroundColor: {
    red: colorObj,
    blue: colorObj,
    green: colorObj
  },
  foregroundColor: {
    red: colorObj,
    blue: colorObj,
    green: colorObj
  },
  fontFamily: {
    type: String,
    enum: ['Arial', 'Open Sans', 'Poppins', 'Roboto'],
    default: 'Arial'
  },
  fontSize: {
    type: Number,
    enum: [11, 15, 26],
    default: 11
  },
  bold: {
    type: Boolean,
    default: false
  },
  italic: {
    type: Boolean,
    default: false
  },
  underline: {
    type: Boolean,
    default: false
  }
}

const StyleSchema = mongoose.Schema({
  heading: styleObj,
  subheading: styleObj,
  bullet: styleObj,
  paragraph: styleObj,
})

module.exports = mongoose.model('Style', StyleSchema)