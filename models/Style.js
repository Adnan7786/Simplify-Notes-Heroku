//npm module
const mongoose = require('mongoose')
const validator = require('validator')

const StyleSchema = mongoose.Schema({
  heading: {
    backgroundColor: {
      red: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 1.0,
        required: true
      },
      blue: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 1.0,
        required: true
      },
      green: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 1.0,
        required: true
      }
    },
    foregroundColor: {
      red: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.0,
        required: true
      },
      blue: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.0,
        required: true
      },
      green: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.0,
        required: true
      }
    },
    fontFamily: {
      type: String,
      enum: ['Comic Sans MS', 'Georgia', 'Roboto', 'Times New Roman'],
      default: 'Roboto',
      required: true
    },
    fontSize: {
      type: Number,
      enum: [11, 15, 26],
      default: 26,
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
  },
  subheading: {
    backgroundColor: {
      red: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 1.0,
        required: true
      },
      blue: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 1.0,
        required: true
      },
      green: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 1.0,
        required: true
      }
    },
    foregroundColor: {
      red: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.4,
        required: true
      },
      blue: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.4,
        required: true
      },
      green: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.4,
        required: true
      }
    },
    fontFamily: {
      type: String,
      enum: ['Comic Sans MS', 'Georgia', 'Roboto', 'Times New Roman'],
      default: 'Roboto',
      required: true
    },
    fontSize: {
      type: Number,
      enum: [11, 15, 26],
      default: 15,
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
  },
  bullet: {
    backgroundColor: {
      red: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 1.0,
        required: true
      },
      blue: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 1.0,
        required: true
      },
      green: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 1.0,
        required: true
      }
    },
    foregroundColor: {
      red: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.0,
        required: true
      },
      blue: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.0,
        required: true
      },
      green: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.0,
        required: true
      }
    },
    fontFamily: {
      type: String,
      enum: ['Comic Sans MS', 'Georgia', 'Roboto', 'Times New Roman'],
      default: 'Roboto',
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
  },
  paragraph: {
    backgroundColor: {
      red: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 1.0,
        required: true
      },
      blue: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 1.0,
        required: true
      },
      green: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 1.0,
        required: true
      }
    },
    foregroundColor: {
      red: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.0,
        required: true
      },
      blue: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.0,
        required: true
      },
      green: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.0,
        required: true
      }
    },
    fontFamily: {
      type: String,
      enum: ['Comic Sans MS', 'Georgia', 'Roboto', 'Times New Roman'],
      default: 'Roboto',
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
  },
  bulletPreset: {
    type: String,
    enum: ['BULLET_DISC_CIRCLE_SQUARE', 'BULLET_CHECKBOX', 'NUMBERED_DECIMAL_NESTED', 'NUMBERED_UPPERROMAN_UPPERALPHA_DECIMAL'],
    default: 'BULLET_DISC_CIRCLE_SQUARE',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = mongoose.model('Style', StyleSchema)