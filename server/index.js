import http from 'http'
import { URL } from 'url'

import getBrowsers from './get-browsers.js'

const DEFAULT_QUERY = 'defaults'
const PORT = process.env.PORT || 5000

http
  .createServer(async (req, res) => {
    let url = new URL(req.url, `http://${req.headers.host}/`)

    if (url.pathname === '/') {
      let query = url.searchParams.get('q') || DEFAULT_QUERY
      let queryWithoutQuotes = query.replace(/'/g, '')

      try {
        let browsers = await getBrowsers(queryWithoutQuotes)
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/json'
        })
        res.write(JSON.stringify(browsers))
        res.end()
      } catch (error) {
        res.writeHead(400, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/json'
        })
        res.write(JSON.stringify({ error }))
        res.end()
      }
    }
  })
  .listen(PORT)
