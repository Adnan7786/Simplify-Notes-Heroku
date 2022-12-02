const User = require('../models/User')
const Folder = require('../models/Folder')
const Document = require('../models/Document')


const findUserById = async (_id) => {
  const user = await User.findOne({ _id })
  return user
}

const findUserByGoogleId = async (googleID) => {
  const user = await User.findOne({ googleID })
  return user
}

const findAllUsers = async () => {
  const users = await User.find({ role: 'user' }) //find all users with role as user
  return users
}

const updateUser = async (user, payload) => {
  if (user.name !== payload.name) {
    user = await User.findOneAndUpdate({ googleID: payload.sub }, { name: payload.name }, { new: true, runValidators: true })
  }
  if (user.email !== payload.email) {
    user = await User.findOneAndUpdate({ googleID: payload.sub }, { email: payload.email }, { new: true, runValidators: true })
  }
  if (user.image !== payload.picture) {
    user = await User.findOneAndUpdate({ googleID: payload.sub }, { image: payload.picture }, { new: true, runValidators: true })
  }
  return user
}

const createUser = async (payload) => {
  const user = await User.create({
    name: payload.name,
    email: payload.email,
    googleID: payload.sub,
    subscription: {
      plan: 'free-trial',
      expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    },
    image: payload.picture,
    role: 'user',
  })
  return user
}

const storeRefreshToken = async (_id, tokens) => {
  let user = await User.findOne({ _id })
  user.googleRefreshToken = tokens.refresh_token
  user = await user.save()
  return user
}

// const storeDocumentID = async (_id, docID) => {
//   const user = User.findOneAndUpdate({ _id }, { currentDocID: docID }, { new: true, runValidators: true })
//   return user
// }

// const removeDocumentID = async (googleID, documentId) => {
//   let user = null
//   let userUpdated = false
//   if (user.currentDocID === documentId) {
//     user = User.findOneAndUpdate({ googleID: googleID }, { currentDocID: null }, { new: true, runValidators: true })
//     userUpdated = true
//   }
//   return { user, userUpdated }
// }

const findFolder = async (payload) => {
  const folder = await Folder.findOne(payload)
  return folder
}

const findAllFolders = async (payload) => {
  const folders = await Folder.find(payload)
    .select('id name createdAt updatedAt')
    .populate({
      path: 'folders',
      select: 'id',
    })
    .populate({
      path: 'documents',
      select: 'id',
    })
  return folders
}

const createFolder = async (payload) => {
  const folder = await Folder.create(payload)
  return folder
}

const findDocument = async (payload) => {
  const document = await Document.findOne(payload)
  return document
}

const findAllDocuments = async (payload) => {
  const documents = await Document.find(payload)
  return documents
}

const createDocument = async (payload) => {
  const document = await Document.create(payload)
  return document
}


module.exports = {
  findUserById,
  findUserByGoogleId,
  findAllUsers,
  updateUser,
  createUser,
  storeRefreshToken,
  // storeDocumentID,
  // removeDocumentID,
  findFolder,
  findDocument,
  findAllFolders,
  findAllDocuments,
  createFolder,
  createDocument
}