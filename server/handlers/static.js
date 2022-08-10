import fs from 'fs'
import path from 'path'
import { URL } from 'node:url'

import { sendResponse, sendResponseError } from '../lib/send-response.js'

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
  '.svg': 'image/svg+xml'
}

export default async function handleStatic(req, res) {
  let filePath

  if (req.url.includes(ASSETS_DIR)) {
    filePath = new URL(`${CLIENT_DIR}${req.url}`, import.meta.url)
  } else {
    filePath = new URL(`${CLIENT_DIR}${DIST_DIR}${req.url}`, import.meta.url)
  }

  fs.access(filePath, fs.constants.F_OK, error => {
    if (error) {
      sendResponseError(res, 404, 'Not Found')
    }
  })

  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendResponseError(res, 500, 'Internal Server Error')
    } else {
      let resHeaders = {
        'Content-Type': getMimeType(req.url),
        'Cache-Control': getCacheControl(req.url)
      }
      sendResponse(res, 200, resHeaders, content)
    }
  })
}

function getMimeType(fileUrl) {
  return MIME_TYPES[path.extname(fileUrl)] || 'application/octet-stream'
}

function getCacheControl(fileUrl) {
  let { name: fileName } = path.parse(fileUrl)
  let hasFileCacheBuster = /\.(\w{8})$/.test(fileName)

  return hasFileCacheBuster
    ? 'public, max-age=31536000, immutable'
    : 'max-age=3600'
}
