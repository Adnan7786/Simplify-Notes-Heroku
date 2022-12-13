//npm module
const { StatusCodes } = require('http-status-codes')
const { v4: uuidv4 } = require('uuid')

//custom module
const { BadRequestError, InternalServerError, UnauthorizedError } = require('../errors')

//custom module
const {
  getFolderTree,
  addFolderToFolderTree,
  renameFolderInFolderTree,
  deleteFolderFromFolderTree,
  createGoogleDoc,
  getGoogleDoc,
  checkDocEditPermission,
  storeDocumentID,
  removeDocumentID,
  attachCookiesToResponse,
  addDocumentToFolderTree,
  renameDocumentInFolderTree,
  deleteDocumentFromFolderTree,
  createTokenUser,
  findFolder,
  findDocument,
  findAllFolders,
  findAllDocuments,
  createFolder: createFolderInDB,
  createDocument: createDocumentInDB,
  findUserById
} = require('../utils')
const Folder = require('../models/Folder')
const { get } = require('express/lib/response')

const fetchFolderTree = async (req, res) => {
  const userId = req.user.userId


  const rootFolder = await findFolder({ user: userId, parentFolder: null })
  if (!rootFolder) {
    throw new InternalServerError('No root folder found')
  }

  const rootId = rootFolder._id
  const userFolders = await findAllFolders({ user: userId })
  const userDocuments = await findAllDocuments({ user: userId })

  const folders = {}
  userFolders.forEach((folder) => {
    folder['folders'] = folder['folders'].map((folderObj) => folderObj._id)
    folder['documents'] = folder['documents'].map((documentObj) => documentObj._id)
    folders[folder._id] = {
      'name': folder.name,
      'createdAt': folder.createdAt,
      'updatedAt': folder.updatedAt,
      'folders': folder.folders,
      'documents': folder.documents
    }
  })

  const documents = {}
  userDocuments.forEach((document) => {
    documents[document._id] = {
      'name': document.name,
      'docID': document.docID,
      'createdAt': document.createdAt,
      'updatedAt': document.updatedAt,
      'currentlyEditing': document.currentlyEditing
    }
  })

  const folderTree = {
    rootId,
    folders,
    documents
  }

  return res.status(StatusCodes.OK).json(folderTree)
}

const createFolder = async (req, res) => {
  const userId = req.user.userId
  console.log('dashboard controller' + userId);
  let { name, parentFolderId } = req.body
  if (!parentFolderId) {
    throw new BadRequestError('Please provide parentFolderId value')
  }

  name = name.trim()

  if (name.length < 1 || name.length > 20) {
    throw new BadRequestError('Name should not be less than 1 characters or more than 20 characters long')
  }

  const parentFolder = await findFolder({
    _id: parentFolderId,
    user: userId
  })
  if (!parentFolder) {
    throw new BadRequestError('Please provide correct parentFolderId value')
  }

  const folder = await createFolderInDB({
    name: name,
    parentFolder: parentFolderId,
    user: userId
  })

  if (!folder) {
    throw new InternalServerError('Something went wrong. Please try again later')
  }

  return res.status(StatusCodes.OK).json({ name: folder.name, folderId: folder._id })
}



const renameFolder = async (req, res) => {
  const userId = req.user.userId
  let { name, folderId } = req.body
  if (!name || !folderId) {
    throw new BadRequestError('Please provide name and folderId value')
  }

  name = name.trim()

  if (name.length < 1 || name.length > 20) {
    throw new BadRequestError('Name should not be less than 1 characters or more than 20 characters long')
  }

  const folder = await findFolder({
    _id: folderId,
    user: userId
  })
  if (!folder) {
    throw new BadRequestError('Please provide correct folderId value')
  }

  folder.name = name
  await folder.save()

  return res.status(StatusCodes.OK).json({ name })
}



const deleteFolder = async (req, res) => {
  const userId = req.user.userId
  let { folderId } = req.body
  if (!folderId) {
    throw new BadRequestError('Please provide folderId value')
  }

  const folder = await findFolder({
    _id: folderId,
    user: userId
  })

  if (!folder) {
    throw new BadRequestError('Please provide correct folderId value')
  }

  if (!folder.parentFolder) {
    throw new BadRequestError('Cannot delete root folder')
  }

  await folder.remove()
  return res.status(StatusCodes.OK).json({})
}



const createDocument = async (req, res) => {
  const userId = req.user.userId
  let { name, parentFolderId } = req.body
  if (!name || !parentFolderId) {
    throw new BadRequestError('Please provide name and parentFolderId value')
  }

  name = name.trim()

  if (name.length < 1 || name.length > 20) {
    throw new BadRequestError('Name should not be less than 1 characters or more than 20 characters long')
  }

  const parentFolder = await findFolder({
    _id: parentFolderId,
    user: userId
  })
  if (!parentFolder) {
    throw new BadRequestError('Please provide correct parentFolderId value')
  }


  const { title, documentId } = await createGoogleDoc(name)

  const currentDoc = await findDocument({
    currentlyEditing: true,
    user: userId
  })

  const document = await createDocumentInDB({
    name: title,
    docID: documentId,
    currentlyEditing: true,
    parentFolder: parentFolderId,
    user: userId
  })

  if (!document) {
    throw new InternalServerError('Something went wrong. Please try again later')
  }

  if (currentDoc) {
    currentDoc.currentlyEditing = false
    await currentDoc.save()
  }

  let user = await findUserById(userId)
  console.log('user earlier', user)
  user.currentDocID = document.docID
  user = await user.save()
  const tokenUser = createTokenUser(user)
  console.log('token user after', tokenUser)
  attachCookiesToResponse({ res, user: tokenUser })

  console.log('log' + parentFolderId + title + documentId);

  return res.status(StatusCodes.OK).json({ name: document.name, documentId: document._id })
}

const renameDocument = async (req, res) => {
  const userId = req.user.userId
  let { name, documentId } = req.body
  if (!name || !documentId) {
    throw new BadRequestError('Please provide name and documentId value')
  }

  name = name.trim()

  if (name.length < 1 || name.length > 20) {
    throw new BadRequestError('Name should not be less than 1 characters or more than 20 characters long')
  }

  const document = await findDocument({
    _id: documentId,
    user: userId
  })
  if (!document) {
    throw new BadRequestError('Please provide correct documentId value')
  }

  // console.log('doc ' + document);
  document.name = name
  await document.save()

  return res.status(StatusCodes.OK).json({ name })
}

const addExisting = async (req, res) => {
  const userId = req.user.userId
  let { documentId, parentFolderId } = req.body
  if (!documentId || !parentFolderId) {
    throw new BadRequestError('Please provide documentId and parentFolderId value')
  }

  const parentFolder = await findFolder({
    _id: parentFolderId,
    user: userId
  })
  if (!parentFolder) {
    throw new BadRequestError('Please provide correct parentFolderId value')
  }

  const isEditable = await checkDocEditPermission(documentId)

  if (!isEditable) {
    throw new UnauthorizedError('User does not have editing permission for this document')
  }

  const { title } = await getGoogleDoc(documentId)

  const currentDoc = await findDocument({
    currentlyEditing: true,
    user: userId
  })

  const document = await createDocumentInDB({
    name: title,
    docID: documentId,
    currentlyEditing: true,
    parentFolder: parentFolderId,
    user: userId
  })

  if (!document) {
    throw new InternalServerError('Something went wrong. Please try again later')
  }

  if (currentDoc) {
    currentDoc.currentlyEditing = false
    await currentDoc.save()
  }

  let user = await findUserById(userId)
  user.currentDocID = document.docID
  user = await user.save()
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })

  return res.status(StatusCodes.OK).json({ name: document.name, documentId: document._id })
}

const setCurrEditingDoc = async (req, res) => {
  const userId = req.user.userId

  let { documentId } = req.body
  if (!documentId) {
    throw new BadRequestError('Please provide documentId value')
  }

  const document = await findDocument({
    _id: documentId,
    user: userId
  })
  if (!document) {
    throw new BadRequestError('Please provide correct documentId value')
  }

  const currentDoc = await findDocument({
    currentlyEditing: true,
    user: userId
  })

  console.log(currentDoc?._id, documentId);
  if (currentDoc && currentDoc._id == documentId) {
    throw new BadRequestError('Already editing the specified document');
  }

  if (currentDoc) {
    currentDoc.currentlyEditing = false
    await currentDoc.save()
  }

  // console.log('doc ' + document);
  document.currentlyEditing = true
  await document.save()

  let user = await findUserById(userId)
  user.currentDocID = document.docID
  user = await user.save()
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })

  return res.status(StatusCodes.OK).json({})
}

const deleteDocument = async (req, res) => {
  const userId = req.user.userId
  const { documentId } = req.body
  if (!documentId) {
    throw new BadRequestError('Please provide documentId value')
  }

  const document = await findDocument({
    _id: documentId,
    user: userId
  })
  if (!document) {
    throw new BadRequestError('Please provide correct documentId value')
  }
  // console.log('doc ' + document);
  await document.remove()


  let user = await findUserById(userId)
  if (user.currentDocID === document.docID) {
    user.currentDocID = null
    user = await user.save()
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({ res, user: tokenUser })
  }

  return res.status(StatusCodes.OK).json({})
}

module.exports = {
  fetchFolderTree,
  createFolder,
  renameFolder,
  deleteFolder,
  createDocument,
  renameDocument,
  addExisting,
  setCurrEditingDoc,
  deleteDocument
}