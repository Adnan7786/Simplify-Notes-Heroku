//npm module
const mongoose = require('mongoose')

const FolderSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 1,
    maxlength: 20
  },
  parentFolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

FolderSchema.virtual('folders', {
  ref: 'Folder',
  localField: '_id',
  foreignField: 'parentFolder',
  justOne: false,
});

FolderSchema.virtual('documents', {
  ref: 'Document',
  localField: '_id',
  foreignField: 'parentFolder',
  justOne: false,
});

FolderSchema.pre('remove', async function () {
  const subfolders = await this.model('Folder').find({ parentFolder: this._id });
  console.log(subfolders);

  //recursively delete all folders
  subfolders.forEach(async (folder) => {
    await folder.remove()
  })
  await this.model('Document').deleteMany({ parentFolder: this._id });
});

module.exports = mongoose.model('Folder', FolderSchema)