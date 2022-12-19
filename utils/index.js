const {
  createJWT,
  isTokenValid,
  attachCookiesToResponse
} = require('./jwt')

const {
  verifyCsrfToken,
  verifyIdToken
} = require('./googleAuthentication')

const {
  generateAuthUrl,
  generateAuthToken,
  setCredentials,
  getCredentials
} = require('./googleAuthorization')

const {
  findUserById,
  findUserByGoogleId,
  findAllUsers,
  updateUser,
  createUser,
  storeRefreshToken,
  findFolder,
  findDocument,
  findAllFolders,
  findAllDocuments,
  createFolder,
  createDocument,
  getUserStyle,
  updateUserStyle
} = require('./model')

const createTokenUser = require('./createTokenUser')

const {
  createGoogleDoc,
  getGoogleDoc,
  checkDocEditPermission,
  updateGoogleDoc
} = require('./googleDocs')

const {
  formatText,
  setInsertRequests,
  setUpdateStyleRequests,
  setImageRequests
} = require('./notes')

const {
  createNewFolderTree,
  getFolderTree,
  addFolderToFolderTree,
  renameFolderInFolderTree,
  deleteFolderFromFolderTree,
  addDocumentToFolderTree,
  renameDocumentInFolderTree,
  deleteDocumentFromFolderTree,
  deleteFolderTree,
  createRequestsJsonFile,
  deleteRequestsJsonFile,
  addRequestObject,
  getRequestsArray,
  clearRequestArray,
  createTempImagesDirectory,
  deleteTempImagesDirectory,
  saveTempImage,
  deleteTempImages,
  createUserFiles,
  deleteUserFiles,
} = require('./media')

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  verifyCsrfToken,
  verifyIdToken,
  generateAuthUrl,
  generateAuthToken,
  setCredentials,
  getCredentials,
  findUserById,
  findUserByGoogleId,
  findAllUsers,
  updateUser,
  createUser,
  createTokenUser,
  storeRefreshToken,
  createGoogleDoc,
  getGoogleDoc,
  checkDocEditPermission,
  updateGoogleDoc,
  formatText,
  setInsertRequests,
  setUpdateStyleRequests,
  setImageRequests,
  createNewFolderTree,
  getFolderTree,
  deleteFolderTree,
  createRequestsJsonFile,
  deleteRequestsJsonFile,
  addRequestObject,
  getRequestsArray,
  addFolderToFolderTree,
  renameFolderInFolderTree,
  deleteFolderFromFolderTree,
  addDocumentToFolderTree,
  renameDocumentInFolderTree,
  deleteDocumentFromFolderTree,
  clearRequestArray,
  createTempImagesDirectory,
  deleteTempImagesDirectory,
  saveTempImage,
  deleteTempImages,
  createUserFiles,
  deleteUserFiles,
  findFolder,
  findDocument,
  findAllFolders,
  findAllDocuments,
  createFolder,
  createDocument,
  getUserStyle,
  updateUserStyle
}