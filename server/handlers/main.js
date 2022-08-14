import { URL } from 'node:url'

import getFileData from '../lib/get-file-data.js'
import { sendResponse, sendResponseError } from '../lib/send-response.js'

const responseHeaders = {
  'Content-Type': 'text/html',
  'Cache-Control': 'public, max-age=300, must-revalidate',
  'Content-Security-Policy':
    `object-src 'none'; ` +
    `frame-ancestors 'none'; ` +
    `style-src 'self'; ` +
    `script-src 'self'`,
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff'
}

if (process.env.NODE_ENV === 'production') {
  responseHeaders['Strict-Transport-Security'] =
    'max-age=31536000; includeSubDomains; preload'
}

export default async function handleMain(req, res) {
  let filePath = new URL('../../client/dist/index.html', import.meta.url)

  try {
    let { data } = await getFileData(filePath, true)
    sendResponse(res, 200, responseHeaders, data)
  } catch (error) {
    if (error.httpStatus) {
      sendResponseError(res, error.httpStatus, error.message)
    } else {
      sendResponseError(res, 500, 'Internal Server Error')
    }
  }
}
