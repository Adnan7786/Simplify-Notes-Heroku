//npm module
const express = require('express')

//custom module
const {
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  showCurrentUser,
  updateCurrentDocID
} = require('../controller/user')
const { authorizePermissions } = require('../middleware/google-authentication')

const router = express.Router()

router.route('/').get(authorizePermissions, getAllUsers)
router.route('/showMe').get(showCurrentUser)
// router.route('/update-document-id').patch(updateCurrentDocID)
router.route('/:id').get(authorizePermissions, getSingleUser).delete(authorizePermissions, deleteSingleUser)


module.exports = router