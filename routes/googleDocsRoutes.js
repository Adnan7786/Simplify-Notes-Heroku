//npm module
const express = require('express')

//custom module
const {
  createDocument,
  getDocument,
  storeDocID,
  updateDocument
} = require('../controller/googleDocs')

const router = express.Router()

// router.post('/create', createDocument, storeDocID)
// router.post('/update', getDocument, storeDocID)
router.post('/update', updateDocument)

module.exports = router