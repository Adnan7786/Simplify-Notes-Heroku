//npm module
const { StatusCodes } = require('http-status-codes')

//custom module
const { BadRequestError } = require('../errors')
const {
  findAllUsers,
  findUserById,
  deleteUserFiles,
  storeDocumentID,
  createTokenUser,
  attachCookiesToResponse
} = require('../utils')

//only for admin 
const getAllUsers = async (req, res) => {
  const users = await findAllUsers()
  res.status(StatusCodes.OK).json({ users })
}

//only for admin 
const getSingleUser = async (req, res) => {
  const userId = req.params.id
  const user = await findUserById(userId)
  if (!user) {
    throw new BadRequestError(`No user with id : ${userId}`)
  }
  res.status(StatusCodes.OK).json({ user })
}

//only for admin 
const deleteSingleUser = async (req, res) => {
  const userId = req.params.id
  const user = await findUserById(userId)
  if (!user) {
    throw new BadRequestError(`No user with id : ${userId}`)
  }
  await user.remove()
  // await deleteUserFiles(userId)
  res.status(StatusCodes.OK).json({})
}

const showCurrentUser = async (req, res) => {
  const userId = req.user.userId
  console.log('from user controller' + userId);
  const user = await findUserById(userId)
  if (!user) {
    throw new BadRequestError(`User is no longer available`)
  }
  const { name, email, image, subscription, currentDocID, createdAt } = user
  res.status(StatusCodes.OK).json({ user: { name, email, image, subscription, currentDocID, createdAt } })
}

// const updateCurrentDocID = async (req, res) => {
//   const { userId } = req.user
//   const { documentId } = req.body



//   // const user = await storeDocumentID(userId, documentId)
//   // const tokenUser = createTokenUser(user)
//   // attachCookiesToResponse({ res, user: tokenUser })
//   res.status(StatusCodes.OK).json({})
// }


module.exports = {
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  showCurrentUser,
  // updateCurrentDocID
}