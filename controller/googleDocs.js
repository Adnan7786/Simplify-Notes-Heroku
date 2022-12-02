//npm module
const { StatusCodes } = require('http-status-codes')

//custom module
const { BadRequestError, InternalServerError } = require('../errors')

//custom module
const { createGoogleDoc, getGoogleDoc, updateGoogleDoc, createTokenUser, attachCookiesToResponse, storeDocumentID } = require('../utils')

const createDocument = async (req, res, next) => {
  const { title } = req.body || 'Untitled document'  //* validation required here *
  const data = await createGoogleDoc(title)
  req.body.docID = data.documentId
  next()
}

const getDocument = async (req, res, next) => {
  const { documentID } = req.body
  if (!documentID) {
    throw new BadRequestError('Please provide document ID')
  }
  const data = await getGoogleDoc(documentID)
  req.body.docID = data.documentId
  next()
}

const storeDocID = async (req, res) => {
  const { docID } = req.body
  const user = await storeDocumentID(req.user.userId, docID)
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.OK).json({ docID })
}

const updateDocument = async (req, res) => {
  const { userId, currentDocID } = req.user
  const response = await updateGoogleDoc(userId, currentDocID)
  if (!response) {
    throw new InternalServerError('Something went wrong. Please try again later.')
  }
  return res.status(StatusCodes.OK).json({})
}
module.exports = {
  createDocument,
  getDocument,
  storeDocID,
  updateDocument
}