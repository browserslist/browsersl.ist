import { readFile } from 'fs'
import path from 'path'
import { URL } from 'node:url'

const MIME_TYPES = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.svg': 'image/svg+xml'
}

export default async function handleStatic(req, res) {
  let filePath = req.url.includes('/assets/')
    ? new URL(`../../client${req.url}`, import.meta.url)
    : new URL(`../../client/dist${req.url}`, import.meta.url)

  let extname = path.extname(req.url)

  readFile(filePath, (error, content) => {
    if (!error) {
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[extname] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable'
      })
      res.end(content, 'utf-8')
    } else {
      res.writeHead(404)
      res.end('404 Not found')
    }
  })
}
