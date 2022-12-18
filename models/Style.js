//npm module
const mongoose = require('mongoose')
const validator = require('validator')

const StyleSchema = mongoose.Schema({
  name: String
  // heading: {
  //   backgroundColor: {
  //     red: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     },
  //     blue: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     },
  //     green: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     }
  //   },
  //   foregroundColor: {
  //     red: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     },
  //     blue: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     },
  //     green: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     }
  //   },
  //   fontFamily: {
  //     type: String,
  //     enum: ['Arial', 'Open Sans', 'Poppins', 'Roboto'],
  //     default: 'Arial'
  //   },
  //   fontSize: {
  //     type: Number,
  //     enum: [11, 15, 26],
  //     default: 11
  //   },
  //   bold: {
  //     type: Boolean,
  //     default: false
  //   },
  //   italic: {
  //     type: Boolean,
  //     default: false
  //   },
  //   underline: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  // subheading: {
  //   backgroundColor: {
  //     red: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     },
  //     blue: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     },
  //     green: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     }
  //   },
  //   foregroundColor: {
  //     red: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     },
  //     blue: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     },
  //     green: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     }
  //   },
  //   fontFamily: {
  //     type: String,
  //     enum: ['Arial', 'Open Sans', 'Poppins', 'Roboto'],
  //     default: 'Arial'
  //   },
  //   fontSize: {
  //     type: Number,
  //     enum: [11, 15, 26],
  //     default: 11
  //   },
  //   bold: {
  //     type: Boolean,
  //     default: false
  //   },
  //   italic: {
  //     type: Boolean,
  //     default: false
  //   },
  //   underline: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  // bullet: {
  //   backgroundColor: {
  //     red: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     },
  //     blue: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     },
  //     green: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     }
  //   },
  //   foregroundColor: {
  //     red: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     },
  //     blue: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     },
  //     green: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     }
  //   },
  //   fontFamily: {
  //     type: String,
  //     enum: ['Arial', 'Open Sans', 'Poppins', 'Roboto'],
  //     default: 'Arial'
  //   },
  //   fontSize: {
  //     type: Number,
  //     enum: [11, 15, 26],
  //     default: 11
  //   },
  //   bold: {
  //     type: Boolean,
  //     default: false
  //   },
  //   italic: {
  //     type: Boolean,
  //     default: false
  //   },
  //   underline: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  // paragraph: {
  //   backgroundColor: {
  //     red: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     },
  //     blue: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     },
  //     green: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     }
  //   },
  //   foregroundColor: {
  //     red: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     },
  //     blue: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     },
  //     green: {
  //       type: Number,
  //       min: 0.0,
  //       max: 1.0
  //     }
  //   },
  //   fontFamily: {
  //     type: String,
  //     enum: ['Arial', 'Open Sans', 'Poppins', 'Roboto'],
  //     default: 'Arial'
  //   },
  //   fontSize: {
  //     type: Number,
  //     enum: [11, 15, 26],
  //     default: 11
  //   },
  //   bold: {
  //     type: Boolean,
  //     default: false
  //   },
  //   italic: {
  //     type: Boolean,
  //     default: false
  //   },
  //   underline: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
})

module.exports = mongoose.model('Style', StyleSchema)