//npm module
const { StatusCodes } = require('http-status-codes')
const cloudinary = require('cloudinary').v2

//custom module
const { BadRequestError, NotFoundError, InternalServerError } = require('../errors')
const { formatText, setInsertRequests, setUpdateStyleRequests, setImageRequests, addRequestObject, getGoogleDoc, updateGoogleDoc, clearRequestArray, saveTempImage, deleteTempImages } = require('../utils')

const insert = async (req, res) => {
  const style = req.params.style
  const { userId, currentDocID } = req.user
  console.log('insert controleer + ' + userId + ' ' + currentDocID);
  let insertRequests = null
  let public_id = null
  const allowedStyles = ["heading", "subheading", "paragraph", "bullet", "image"]
  if (!(allowedStyles.includes(style))) {
    throw new NotFoundError("Requested route not found")
  }

  if (style === 'image') {

    const { image, height, width } = req.body
    // console.log('kkkkkk' + ' ' + image + ' ' + height + + ' ' + width);
    if (!image || !height || !width) {
      throw new BadRequestError('Please provide image, height and width values')
    }

    if (!image.startsWith("data:image") && !image.startsWith("https://") && !image.startsWith("http://")) {
      throw new BadRequestError('Please provide image link or base64 string')
    }

    if (!(typeof height === 'number') || !(typeof width === 'number')) {
      throw new BadRequestError('Please provide correct height and width values')
    }

    let imageSrc = null
    if (image.startsWith("data:image")) {
      const result = await cloudinary.uploader.upload(image, { folder: 'tmp' })
      // console.log('resultttt', result);
      imageSrc = result.secure_url
      public_id = result.public_id
    }
    else {
      imageSrc = image
    }
    console.log('path from controller ' + imageSrc);
    insertRequests = setImageRequests(imageSrc, height, width)
  }
  else {

    const { text } = req.body
    if (!text || text === '') {
      throw new BadRequestError('Please provide text value')
    }

    const formattedText = formatText(text, style)
    insertRequests = setInsertRequests(formattedText, style)
  }

  const response = await updateGoogleDoc(userId, currentDocID, insertRequests)
  if (!response) {
    throw new InternalServerError('Something went wrong. Please try again later.')
  }

  if (public_id) {
    const deleted = await cloudinary.uploader.destroy(public_id)
    console.log('is deleted ', deleted);
  }
  console.log('update');

  // const requestsLength = await addRequestObject(userId, insertRequests)
  // if (requestsLength >= 1) {
  //   const response = await updateGoogleDoc(userId, currentDocID)
  //   if (!response) {
  //     throw new InternalServerError('Something went wrong. Please try again later.')
  //   }
  // }
  return res.status(StatusCodes.OK).json({})
}


module.exports = {
  insert
}