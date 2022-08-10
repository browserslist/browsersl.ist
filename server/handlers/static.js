import { URL } from 'node:url'

import { sendResponse, sendResponseError } from '../lib/send-response.js'
import getFileData from '../lib/get-file-data.js'

const CLIENT_DIR = '../../client'
const DIST_DIR = '/dist'
const ASSETS_DIR = '/assets'
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
}

export default async function handleStatic(req, res) {
  let filePath

  if (req.url.includes(ASSETS_DIR)) {
    filePath = new URL(`${CLIENT_DIR}${req.url}`, import.meta.url)
  } else {
    filePath = new URL(`${CLIENT_DIR}${DIST_DIR}${req.url}`, import.meta.url)
  }

  try {
    let { name, ext, size, data } = await getFileData(filePath)
    let resHeaders = {
      'Cache-Control': getCacheControl(name),
      'Content-Type': getContentType(ext),
      'Content-Length': size
    }
    sendResponse(res, 200, resHeaders, data)
  } catch ({ status, message }) {
    sendResponseError(res, status, message)
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
