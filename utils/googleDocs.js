//npm module
const { google } = require('googleapis')
const { UnauthorizedError } = require('../errors')

//custom module
const { getRequestsArray, clearRequestArray, deleteTempImages } = require('./media')
const { setUpdateStyleRequests } = require('./notes')

const docs = google.docs('v1')

const createGoogleDoc = async (name) => {

  try {
    const response = await docs.documents.create({
      requestBody: { title: name },
    })
    const { title, documentId } = response.data
    console.log(response.config.headers.Authorization)
    return { title, documentId }
  } catch (error) {
    throw new UnauthorizedError(error.message)
  }

}


const getGoogleDoc = async (docID) => {
  try {
    const response = await docs.documents.get({
      documentId: docID
    })
    console.log(response);
    console.log(response.config.headers.Authorization)
    return response.data
  } catch (error) {
    throw new UnauthorizedError(error.message)
  }

}

const checkDocEditPermission = async (docID) => {
  try {
    const reqArray = [
      {
        'insertText': {
          'endOfSegmentLocation': {
            "segmentId": ""
          },
          'text': '\n'
        }
      }
    ]

    await docs.documents.batchUpdate({
      documentId: docID,
      requestBody: {
        requests: reqArray
      }
    })
    return true
  }
  catch (error) {
    return false
  }
}

const updateGoogleDoc = async (userId, docID, requests) => {
  try {
    // const requests = await getRequestsArray(userId)
    if (typeof requests === 'undefined' || requests.length === 0) {
      return false
    }
    const reqArray = []
    for (index in requests) {
      reqArray.push(requests[index].req)
    }

    console.log(reqArray)

    await docs.documents.batchUpdate({
      documentId: docID,
      requestBody: {
        requests: reqArray
      }
    })
    console.log('hogaya');
    const data = await getGoogleDoc(docID)
    const updateStyleReqArray = await setUpdateStyleRequests(data.body.content, requests)
    console.log(updateStyleReqArray);

    if (typeof updateStyleReqArray !== 'undefined' && updateStyleReqArray.length > 0) {
      console.log('howwwww');
      await docs.documents.batchUpdate({
        documentId: docID,
        requestBody: {
          requests: updateStyleReqArray,
          writeControl: {
            targetRevisionId: data.revisionId
          }
        }
      })
    }

    console.log('clearing');

    // await clearRequestArray(userId)
    // await deleteTempImages(userId)
    // console.log(response.config.headers.Authorization)
    return true
  }
  catch (error) {
    console.log(error)
    console.log(error.data)
    console.log(error.message)
    console.log(error.data.error)

    throw new UnauthorizedError(error.message)
  }
}

module.exports = {
  createGoogleDoc,
  getGoogleDoc,
  checkDocEditPermission,
  updateGoogleDoc
}