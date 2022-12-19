//npm module
const mongoose = require('mongoose')
const validator = require('validator')

//custom module
// const { deleteFolderTree, deleteRequestsJsonFile, deleteTempImagesDirectory } = require('../utils')

const Style = require('./Style')

const subscriptionSchema = {
  plan: {
    type: String,
    enum: {
      values: ['free-trial', 'monthly', 'yearly'],
      message: '{VALUE} is not a supported value for plan'
    },
    required: [true, 'Please provide subscription plan']
  },
  expiry_date: {
    type: Date,
    required: [true, 'Please provide subscription expiry date']
  }
}

// const refreshTokenSchema = {
//   token: {
//     type: String,
//     required: [true, 'No refresh token provided']
//   },
//   expiry_date: {
//     type: Date,
//     required: [true, 'Please provide token expiry date']
//   }
// }

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 120
  },
  email: {
    type: String,
    required: [true, 'Please provide email id'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email id'
    }
  },
  googleID: {
    type: Number,
    unique: true,
    required: [true, 'Please provide googleID'],
  },
  image: {
    type: String,
    required: [true, 'Please provide user image url'],
    match: [/^https:\/\/lh3\.googleusercontent\.com.*$/]
  },
  subscription: {
    type: subscriptionSchema
  },
  googleRefreshToken: {
    type: String,
  },
  // rootFolderID: {
  //   type: mongoose.Types.ObjectId
  // },
  currentDocID: {
    type: String,
    match: [/^.*$/] // needs to be updated
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'user'],
      message: '{VALUE} is not a supported value for role'
    },
    default: 'user'
  },
}, { timestamps: true })

// UserSchema.methods.createRootFolder = async function () {
//   const userId = this._id
//   await Folder.create({
//     name: 'Root',
//     isRoot: true,
//     user: userId
//   })
// }

// UserSchema.queue('createRootFolder', [])

UserSchema.post('save', async function () {
  const userId = this._id
  const userRootFolder = await this.model('Folder').findOne({ user: userId, parentFolder: null })
  if (!userRootFolder) await this.model('Folder').create({ name: 'Root', user: userId })
  const userStyle = await Style.findOne({ user: userId })
  if (!userStyle) await Style.create({ user: userId })
})

UserSchema.pre('remove', async function () {
  const userId = this._id
  const userRootFolder = await this.model('Folder').findOne({ user: userId, parentFolder: null })
  console.log('On User remove : ' + userRootFolder);
  if (userRootFolder) {
    await userRootFolder.remove()
  }
  const userStyle = await Style.findOne({ user: userId })
  if (userStyle) {
    await userStyle.remove()
  }
})

module.exports = mongoose.model('User', UserSchema)