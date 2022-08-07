import { readFile } from 'fs'
import { URL } from 'node:url'

export default async function handleMain(req, res) {
  let filePath = new URL(`../../client/dist/index.html`, import.meta.url)

  readFile(filePath, (error, content) => {
    if (!error) {
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=0, must-revalidate'
      })
      res.end(content, 'utf-8')
    } else {
      res.writeHead(500)
      res.end('500 Internal Server Error')
    }
  })
}
