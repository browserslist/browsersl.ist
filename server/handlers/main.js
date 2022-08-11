import { URL } from 'node:url'

import getFileData from '../lib/get-file-data.js'
import { sendResponse, sendResponseError } from '../lib/send-response.js'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const responseHeaders = {
  'Content-Type': 'text/html',
  'Cache-Control': 'public, max-age=300, must-revalidate'
}

let responseCache = null

export default async function handleMain(req, res) {
  let filePath = new URL('../../client/dist/index.html', import.meta.url)

  if (IS_PRODUCTION && responseCache) {
    sendResponse(res, 200, responseHeaders, responseCache)
    return
  }

  try {
    let { data } = await getFileData(filePath)
    sendResponse(res, 200, responseHeaders, data)
    responseCache = data
  } catch ({ status, message }) {
    sendResponseError(res, status, message)
  }
}
