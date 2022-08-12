import { URL } from 'node:url'

import getFileData from '../lib/get-file-data.js'
import { sendResponse, sendResponseError } from '../lib/send-response.js'

const responseHeaders = {
  'Content-Type': 'text/html',
  'Cache-Control': 'public, max-age=300, must-revalidate'
}

export default async function handleMain(req, res) {
  let filePath = new URL('../../client/dist/index.html', import.meta.url)

  try {
    let { data } = await getFileData(filePath, true)
    sendResponse(res, 200, responseHeaders, data)
  } catch ({ status, message }) {
    sendResponseError(res, status, message)
  }
}
