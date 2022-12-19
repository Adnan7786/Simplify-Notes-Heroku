//npm module
const mongoose = require('mongoose')

const DocumentSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 1,
    maxlength: 120
  },
  docID: {
    type: String,
    required: [true, 'Please provide documentId'],
  },
  currentlyEditing: {
    type: Boolean,
    required: true
  },
  parentFolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true })

// DocumentSchema.post('save', async function () {
//   if (this.currentlyEditing) {
//     const userId = this.user
//     const user = await this.model('User').findOne({ _id: userId })
//     user.currentDocID = docID
//     await user.save()
//   }
// })

DocumentSchema.index({ docID: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Document', DocumentSchema)