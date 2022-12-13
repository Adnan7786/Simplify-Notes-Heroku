//npm module
const express = require('express')

//custom module
const {
  fetchFolderTree,
  createFolder,
  renameFolder,
  deleteFolder,
  createDocument,
  addExisting,
  renameDocument,
  setCurrEditingDoc,
  deleteDocument
} = require('../controller/dashboard')
const authorizeUser = require('../middleware/google-authorization')

const router = express.Router()

router.route('/folder-tree').get(fetchFolderTree)
router.route('/folder').post(createFolder).patch(renameFolder).delete(deleteFolder)
router.route('/document').post(authorizeUser, createDocument).patch(renameDocument).delete(deleteDocument)
router.route('/document/add').post(authorizeUser, addExisting)
router.route('/document/edit').post(setCurrEditingDoc)


module.exports = router