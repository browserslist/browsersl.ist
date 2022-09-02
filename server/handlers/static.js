import { URL } from 'node:url'

import { sendResponse, sendResponseError } from '../lib/send-response.js'
import { getFileData } from '../lib/get-file-data.js'

const CLIENT_DIR = '../../client'
const DIST_DIR = '/dist'
const MIME_TYPES = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
}

export async function handleStatic(req, res) {
  let filePath = new URL(`${CLIENT_DIR}${DIST_DIR}${req.url}`, import.meta.url)

  try {
    let shouldBeCached = req.url === '/favicon.ico'
    let { name, ext, size, data } = await getFileData(filePath, shouldBeCached)
    let resHeaders = {
      'Cache-Control': getCacheControl(name),
      'Content-Type': getContentType(ext),
      'Content-Length': size
    }
    sendResponse(res, 200, resHeaders, data)
  } catch (error) {
    if (error.httpStatus) {
      sendResponseError(res, error.httpStatus, error.message)
    } else {
      sendResponseError(res, 500, 'Internal Server Error')
    }
  }
}

function getContentType(ext) {
  return MIME_TYPES[ext] || 'application/octet-stream'
}

function getCacheControl(name) {
  let hasFileCacheBuster = /\.(\w{8})$/.test(name)
  return hasFileCacheBuster
    ? 'public, max-age=31536000, immutable'
    : 'max-age=3600'
}
