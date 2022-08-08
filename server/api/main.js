import { readFile } from 'fs'
import { URL } from 'node:url'

let responseCache = null

export default async function handleMain(req, res) {
  let filePath = new URL(`../../client/dist/index.html`, import.meta.url)

  let sendResponse = content => {
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=300, must-revalidate'
    })
    res.end(content, 'utf-8')
  }

  if (responseCache) {
    sendResponse(responseCache)
  } else {
    readFile(filePath, (error, content) => {
      if (!error) {
        sendResponse(content)
        responseCache = content
      } else {
        res.writeHead(500)
        res.end('500 Internal Server Error')
      }
    })
  }
}
