//npm module
const { readFile, writeFile, unlink, mkdir, readdir, rm } = require('fs').promises
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const createNewFolderTree = async (userId) => {

  const rootId = uuidv4()
  const folderTreeObj = {
    root: rootId,
    folderStructure: {
      folder: {
        [rootId]: {
          parent: null,
          name: "root",
          children: {
            folder: [],
            document: []
          }
        }
      },
      document: {

      }
    }
  }

  const result = await updateFolderTree(userId, folderTreeObj)
  return result
}

async function getFolderTree(userId) {
  const basename = userId.toString() + ".json"
  const folderTreePath = path.join(__dirname, '../media', 'folderTree', basename)
  try {
    var folderTreeJson = await readFile(folderTreePath, 'utf8');
    console.log('try')
  } catch (error) {
    console.log('catch')
    var folderTreeJson = await createNewFolderTree(userId)
  }
  const folderTreeObj = JSON.parse(folderTreeJson)
  console.log('folderTreeObj' + folderTreeObj)
  return folderTreeObj
}

async function updateFolderTree(userId, folderTreeObj) {

  const basename = userId.toString() + ".json"
  const folderTreePath = path.join(__dirname, '../media', 'folderTree', basename)
  const folderTreeJson = JSON.stringify(folderTreeObj)
  try {
    await writeFile(folderTreePath, folderTreeJson, 'utf8')
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

async function addFolderToFolderTree(userId, parentFolderId, newFolderId, folderName) {

  const folderTreeObj = await getFolderTree(userId)
  const folders = folderTreeObj.folderStructure.folder

  const parentFolder = folders[parentFolderId]
  if (!parentFolder) {
    return false
  }

  parentFolder.children.folder.push(newFolderId)

  const newFolderObj = {
    parent: parentFolderId,
    name: folderName,
    children: {
      folder: [],
      document: []
    }
  }

  folders[newFolderId] = newFolderObj

  const result = await updateFolderTree(userId, folderTreeObj)
  return result
}

async function renameFolderInFolderTree(userId, folderId, folderName) {

  const folderTreeObj = await getFolderTree(userId)
  const folders = folderTreeObj.folderStructure.folder
  const reqFolder = folders[folderId]
  if (!reqFolder) {
    return false
  }

  reqFolder.name = folderName

  const result = await updateFolderTree(userId, folderTreeObj)
  return result
}

function recursivelyDeleteFolder(folderId, folders, documents) {
  const reqFolder = folders[folderId]
  if (!reqFolder || reqFolder.parent === null) {
    return
  }
  reqFolder.children.folder.forEach(element => {
    recursivelyDeleteFolder(element, folders, documents)
  })
  reqFolder.children.document.forEach(element => {
    delete documents[element]
  })

  const parentId = reqFolder.parent
  const parentFolder = folders[parentId]

  const index = parentFolder.children.folder.indexOf(folderId)
  if (index > -1) {
    parentFolder.children.folder.splice(index, 1)
  }

  delete folders[folderId]
  return
}

async function deleteFolderFromFolderTree(userId, folderId) {

  const folderTreeObj = await getFolderTree(userId)
  const folders = folderTreeObj.folderStructure.folder
  const documents = folderTreeObj.folderStructure.document
  recursivelyDeleteFolder(folderId, folders, documents)

  const result = await updateFolderTree(userId, folderTreeObj)
  return result
}

async function addDocumentToFolderTree(userId, parentFolderId, documentId, documentName, createdAt) {

  const folderTreeObj = await getFolderTree(userId)
  const folders = folderTreeObj.folderStructure.folder
  const parentFolder = folders[parentFolderId]
  console.log('utils' + parentFolder);
  if (!parentFolder) {
    console.log('if');
    return false
  }

  parentFolder.children.document.push(documentId)

  const newDocumentObj = {
    parent: parentFolderId,
    name: documentName,
    createdAt: createdAt,
    updatedAt: createdAt
  }

  const documents = folderTreeObj.folderStructure.document
  documents[documentId] = newDocumentObj

  const result = await updateFolderTree(userId, folderTreeObj)
  return result
}

async function renameDocumentInFolderTree(userId, documentId, documentName) {

  const folderTreeObj = await getFolderTree(userId)
  const documents = folderTreeObj.folderStructure.document
  const reqDocument = documents[documentId]
  if (!reqDocument) {
    return false
  }

  reqDocument.name = documentName

  const result = await updateFolderTree(userId, folderTreeObj)
  return result
}

async function deleteDocumentFromFolderTree(userId, documentId) {

  const folderTreeObj = await getFolderTree(userId)
  const documents = folderTreeObj.folderStructure.document
  const reqDocument = documents[documentId]
  if (!reqDocument) {
    return false
  }

  const parentId = reqDocument.parent
  const folders = folderTreeObj.folderStructure.folder

  const index = folders[parentId].children.document.indexOf(documentId)
  if (index > -1) {
    folders[parentId].children.document.splice(index, 1)
  }

  delete documents[documentId]

  const result = await updateFolderTree(userId, folderTreeObj)
  return result
}

async function deleteFolderTree(userId) {
  const basename = userId.toString() + ".json"
  const folderTreePath = path.join(__dirname, '../media', 'folderTree', basename)
  try {
    await unlink(folderTreePath)
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

const createRequestsJsonFile = async (userId) => {
  const basename = userId.toString() + ".json"
  const requestsPath = path.join(__dirname, '../media', 'requests', basename)
  const reqObj = { requests: [] }
  const reqJson = JSON.stringify(reqObj)
  try {
    await writeFile(requestsPath, reqJson, 'utf8')
    return reqJson
  } catch (error) {
    console.log(error) //error while writing to file
    return
  }
}

const deleteRequestsJsonFile = async (userId) => {
  const basename = userId.toString() + ".json"
  const requestsPath = path.join(__dirname, '../media', 'requests', basename)
  try {
    await unlink(requestsPath)
    return true
  } catch (error) {
    console.log(error) //error while deleting file
    return false
  }
}


const addRequestObject = async (userId, objs) => {
  const basename = userId.toString() + ".json"
  const requestsPath = path.join(__dirname, '../media', 'requests', basename)
  let reqJson = null
  try {
    reqJson = await readFile(requestsPath, 'utf8')
  } catch (error) {
    console.log(error)
    reqJson = await createRequestsJsonFile(userId)
  }
  console.log('req', reqJson);
  const reqObj = JSON.parse(reqJson)
  reqObj.requests = [...reqObj.requests, ...objs]
  reqJson = JSON.stringify(reqObj)
  try {
    await writeFile(requestsPath, reqJson, 'utf8')
    return reqObj.requests.length
  } catch (error) {
    console.log(error)
  }
}

const getRequestsArray = async (userId) => {
  const basename = userId.toString() + ".json"
  const requestsPath = path.join(__dirname, '../media', 'requests', basename)
  try {
    const reqJson = await readFile(requestsPath, 'utf8')
    const reqObj = JSON.parse(reqJson)
    return reqObj.requests
  } catch (error) {
    console.log(error)
    return
  }
}

const clearRequestArray = async (userId) => {
  const basename = userId.toString() + ".json"
  const requestsPath = path.join(__dirname, '../media', 'requests', basename)
  try {
    let reqJson = await readFile(requestsPath, 'utf8')
    const reqObj = JSON.parse(reqJson)
    reqObj.requests = []
    reqJson = JSON.stringify(reqObj)
    await writeFile(requestsPath, reqJson, 'utf8')
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

const createTempImagesDirectory = async (userId) => {
  const imageDirectory = path.join(__dirname, '../public', 'tmp', userId.toString())
  try {
    await mkdir(imageDirectory, { recursive: true })
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

const deleteTempImagesDirectory = async (userId) => {
  const imageDirectory = path.join(__dirname, '../public', 'tmp', userId.toString())
  try {
    await rm(imageDirectory, { recursive: true, force: true })
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

const saveTempImage = async (userId, base64String) => {
  const base64Array = base64String.split(',')
  const base64Data = base64Array[1]
  const extension = base64Array[0].split('/')[1].split(';')[0]
  // console.log(base64Data)
  // console.log(extension)
  const basename = uuidv4() + '.' + extension
  const imagePath = path.join(__dirname, '../public', 'tmp', userId.toString(), basename)
  console.log('Path from utility :' + imagePath)
  try {
    await readFile(imagePath, 'utf8')
  } catch (error) {
    console.log(error)
    createTempImagesDirectory(userId)
  }

  try {
    await writeFile(imagePath, base64Data, 'base64')
    return path.join(process.env.IMAGE_PREFIX_URL, 'tmp', userId.toString(), basename)
  } catch (error) {
    console.log(error)
  }
}

const deleteTempImages = async (userId) => {
  const imageDirectory = path.join(__dirname, '../public', 'tmp', userId.toString())
  try {
    const files = await readdir(imageDirectory)
    console.log(files)
    for (const file of files) {
      unlink(path.join(imageDirectory, file))
    }
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

const createUserFiles = async (userId) => {
  try {
    await createNewFolderTree(userId)
    await createRequestsJsonFile(userId)
    await createTempImagesDirectory(userId)
  } catch (error) {
    console.log(error)
  }
}

const deleteUserFiles = async (userId) => {
  try {
    await deleteFolderTree(userId)
    await deleteRequestsJsonFile(userId)
    await deleteTempImagesDirectory(userId)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
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
  deleteUserFiles
}