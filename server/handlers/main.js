import fs from 'fs'
import { URL } from 'node:url'

import { sendResponse, sendResponseError } from '../lib/send-response.js'

const responseHeaders = {
  'Content-Type': 'text/html',
  'Cache-Control': 'public, max-age=300, must-revalidate'
}

let responseCache = null

export default async function handleMain(req, res) {
  let filePath = new URL('../../client/dist/index.html', import.meta.url)

  if (responseCache) {
    sendResponse(res, 200, responseHeaders, responseCache)
  } else {
    fs.access(filePath, fs.constants.F_OK, errorAccess => {
      if (errorAccess) {
        sendResponseError(res, 404, 'Not Found')
      } else {
        fs.readFile(filePath, (errorRead, data) => {
          if (errorRead) {
            sendResponseError(res, 500, 'Internal Server Error')
          } else {
            sendResponse(res, 200, responseHeaders, data)
            responseCache = data
          }
        })
      }
    })
  }
}
