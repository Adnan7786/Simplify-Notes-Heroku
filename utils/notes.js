
const paragraghStyle = {
  heading: "TITLE",
  subheading: "SUBTITLE",
  paragraph: "NORMAL_TEXT",
  bullet: "BULLET"
}

const formatText = (text, style) => {
  const formattedText = []
  let textArray = text.split("\n")
  for (index in textArray) {
    let temp = textArray[index].trim()
    if (temp != "") {
      temp = temp.replace(temp.charAt(0), temp.charAt(0).toUpperCase()) //converting first character to upper case 
      temp = temp + "\n" //adding line break
      formattedText.push(temp)
    }
    else {
      //adding empty line between multiple paragraphs and bullets paragraphs and bullets
      if (style === "paragraph" || style === "bullet") formattedText.push("\n")
    }
  }
  //adding extra line after paragraph and bullet
  if (style === "paragraph" || style === "bullet") formattedText.push("\n")
  // console.log("Formatted Text", formattedText)
  return formattedText
}

function setInsertRequests(formattedText, style) {
  const insertRequests = []

  //inserting text requests for each text element in formatted text
  for (index in formattedText) {
    insertRequests.push({
      req: {
        'insertText': {
          'endOfSegmentLocation': {
            "segmentId": ""
          },
          'text': formattedText[index]
        }
      },
      style
    })
  }
  console.log("Insert Requests", insertRequests)
  return insertRequests
}

function setImageRequests(imgSrc, height, width) {
  //console.log(imgSrc)
  height = parseInt(height)
  width = parseInt(width)
  let imgHeight = (height < 500) ? height : 500
  let imgWidth = (width < 500) ? width : 500
  const imageRequest = [
    {
      req: {
        "insertInlineImage": {
          "uri": imgSrc,
          "objectSize": {
            "height": {
              "magnitude": imgHeight,
              "unit": 'PT'
            },
            "width": {
              "magnitude": imgWidth,
              "unit": 'PT'
            }
          },
          "endOfSegmentLocation": {
            "segmentId": ""
          }
        }
      },
      style: "image"
    },
    {
      req: {
        'insertText': {
          'endOfSegmentLocation': {
            "segmentId": ""
          },
          'text': "\n"
        }
      },
      style: "paragraph"
    }
  ]
  return imageRequest
}

async function setUpdateStyleRequests(content, requests, userStyleObj) {
  console.log(userStyleObj);
  requests.reverse()
  content.reverse()
  const updateStyleRequests = []
  let j = 0
  for (i in requests) {
    // console.log('i=', i)
    if (requests[i].style !== 'image' && requests[i].req.insertText.text !== "\n") {
      const style = paragraghStyle[requests[i].style]
      while (j < content.length) {
        // console.log('j=', j)
        if (!content[j].paragraph) {
          j += 1
          continue
        }
        let contextElementArray = content[j].paragraph.elements
        let isFound = false
        for (k in contextElementArray) {
          // console.log('k=', k)
          if (!contextElementArray[k].textRun) {
            continue
          }
          let temp = contextElementArray[k].textRun.content
          if (temp === requests[i].req.insertText.text) {
            isFound = true
            let startIndex = contextElementArray[k].startIndex
            let endIndex = contextElementArray[k].endIndex
            if (style != "BULLET") {
              updateStyleRequests.push(
                {
                  "updateParagraphStyle": {
                    "paragraphStyle": {
                      "namedStyleType": style,
                    },
                    "fields": "*",
                    "range": {
                      "segmentId": "",
                      "startIndex": startIndex,
                      "endIndex": endIndex
                    }
                  }
                }
              )
            }
            else {
              updateStyleRequests.push(
                {
                  'createParagraphBullets': {
                    'range': {
                      'startIndex': startIndex,
                      'endIndex': endIndex
                    },
                    'bulletPreset': 'BULLET_DISC_CIRCLE_SQUARE',
                  }
                }
              )
            }
            break
          }
        }
        if (isFound) {
          j += 1
          break
        }
        j += 1
      }
    }
  }
  // console.log(updateStyleRequests)
  return updateStyleRequests
}



module.exports = {
  formatText,
  setInsertRequests,
  setUpdateStyleRequests,
  setImageRequests
}