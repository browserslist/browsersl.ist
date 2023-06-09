import { URL } from 'node:url'

import { getFileData } from '../lib/get-file-data.js'
import { sendError, sendResponse } from '../lib/send-response.js'

const CLIENT_DIR = '../../client'
const DIST_DIR = '/dist'
const MIME_TYPES = {
  '.css': 'text/css',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2'
}

export async function handleStatic(req, res) {
  let filePath = new URL(`${CLIENT_DIR}${DIST_DIR}${req.url}`, import.meta.url)

  try {
    let shouldBeCached = req.url === '/favicon.ico'
    let { data, ext, name, size } = await getFileData(filePath, shouldBeCached)
    let resHeaders = {
      'Cache-Control': getCacheControl(name),
      'Content-Length': size,
      'Content-Type': getContentType(ext)
    }
    sendResponse(res, 200, resHeaders, data)
  } catch (error) {
    if (error.httpStatus) {
      sendError(res, error.httpStatus, error.message)
    } else {
      sendError(res, 500, 'Internal Server Error')
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
