import http from 'http'
import { URL } from 'url'

import getBrowsers from './get-browsers.js'

const DEFAULT_QUERY = 'defaults'
const GLOBAL_REGION = 'Global'
const PORT = process.env.PORT || 5000

http
  .createServer(async (req, res) => {
    let url = new URL(req.url, `http://${req.headers.host}/`)

    // TODO add endpoints req.get('/'), req.get('/social') etc.
    if (url.pathname === '/') {
      let query = url.searchParams.get('q') || DEFAULT_QUERY
      let queryWithoutQuotes = query.replace(/'/g, '')
      let region = extractRegionFromQuery(query) || GLOBAL_REGION

      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/json'
      })

      try {
        let browsers = await getBrowsers(queryWithoutQuotes, region)
        res.write(JSON.stringify(browsers))
        res.end()
      } catch (error) {
        res.write(JSON.stringify({ error }))
        res.end()
      }
    }
    // TODO error 500
  })
  .listen(PORT)

function extractRegionFromQuery(query) {
  let queryHasIn = query.match(/ in ((?:alt-)?[A-Za-z]{2})(?:,|$)/)
  return queryHasIn ? queryHasIn[1] : undefined
}
