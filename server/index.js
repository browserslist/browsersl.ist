import http from 'http'
import { URL } from 'url'

import getBrowsers from './get-browsers.js'

const DEFAULT_QUERY = 'defaults'
const PORT = process.env.PORT || 5000
const defaultHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'text/json'
}

http
  .createServer(async (req, res) => {
    let url = new URL(req.url, `http://${req.headers.host}/`)

    if (url.pathname === '/') {
      let query = url.searchParams.get('q') || DEFAULT_QUERY
      let queryWithoutQuotes = query.replace(/'/g, '')

      try {
        let browsers = await getBrowsers(queryWithoutQuotes)
        res.writeHead(200, defaultHeaders)
        res.write(JSON.stringify(browsers))
        res.end()
      } catch (error) {
        res.writeHead(400, defaultHeaders)
        res.write(JSON.stringify({ message: error.message }))
        res.end()
      }
    } else {
      res.writeHead(404, defaultHeaders)
      res.write(JSON.stringify({ message: 'Not found' }))
      res.end()
    }
  })
  .listen(PORT)
