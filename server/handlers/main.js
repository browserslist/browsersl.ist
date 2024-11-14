import { URL, URLSearchParams } from 'node:url'

import { getFileData } from '../lib/get-file-data.js'
import { sendError, sendResponse } from '../lib/send-response.js'

const HEADERS = {
  'Cache-Control': 'public, max-age=604800',
  'Content-Security-Policy':
    `object-src 'none'; ` +
    `style-src 'self'; ` +
    `script-src 'self'`,
  'Content-Type': 'text/html; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block'
}
const INDEX = new URL('../../client/dist/index.html', import.meta.url)

export async function handleMain(req, res, url) {
  if (url.searchParams.has('q')) {
    let cleaned = new URLSearchParams()
    for (let param of ['q', 'region']) {
      if (url.searchParams.has(param)) {
        cleaned.set(param, url.searchParams.get(param))
        url.searchParams.delete(param)
      }
    }
    url.hash = '#' + cleaned.toString()
    res.writeHead(301, { Location: url.toString() })
    res.end()
    return
  }

  try {
    let { data } = await getFileData(INDEX, true)
    let headers = HEADERS
    if (!req.headers['X-Forwarded-For']) {
      headers = { ...HEADERS }
      delete headers['Cache-Control']
    }
    sendResponse(res, 200, headers, data)
  } catch (error) {
    if (error.httpStatus) {
      sendError(res, error.httpStatus, error.message)
    } else {
      sendError(res, 500, 'Internal Server Error')
    }
  }
}
