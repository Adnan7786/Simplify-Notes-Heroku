//npm module
const mongoose = require('mongoose')
const validator = require('validator')

const colorObj = {
  type: Number,
  min: 0.0,
  max: 1.0,
  required: true
}

const styleObj = {
  backgroundColor: {
    red: colorObj,
    blue: colorObj,
    green: colorObj,
    required: true
  },
  foregroundColor: {
    red: colorObj,
    blue: colorObj,
    green: colorObj,
    required: true
  },
  fontFamily: {
    type: String,
    enum: ['Arial', 'Open Sans', 'Poppins', 'Roboto'],
    default: 'Arial',
    required: true
  },
  fontSize: {
    type: Number,
    enum: [11, 15, 26],
    default: 11,
    required: true
  },
  bold: {
    type: Boolean,
    default: false,
    required: true
  },
  italic: {
    type: Boolean,
    default: false,
    required: true
  },
  underline: {
    type: Boolean,
    default: false,
    required: true
  }
}

const StyleSchema = mongoose.Schema({
  heading: styleObj,
  subheading: styleObj,
  bullet: styleObj,
  paragraph: styleObj,
})

module.exports = mongoose.model('Style', StyleSchema)