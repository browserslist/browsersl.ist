import { URL } from 'url'
import browserslist from 'browserslist'

import getBrowsers, {
  QUERY_DEFAULTS,
  REGION_GLOBAL
} from '../lib/get-browsers.js'
import sendResponse from '../lib/send-response.js'

export default async function handleBrowsers(req, res) {
  let { searchParams: params } = new URL(req.url, `http://${req.headers.host}/`)

  let query = params.get('q') || QUERY_DEFAULTS
  let queryWithoutQuotes = query.replace(/'/g, '')

  let region =
    params.get('region') ||
    parseRegionFromQuery(queryWithoutQuotes) ||
    REGION_GLOBAL
  try {
    sendResponse(res, 200, await getBrowsers(queryWithoutQuotes, region))
  } catch (error) {
    sendResponse(res, 400, { message: error.message })
  }
}

function parseRegionFromQuery(query) {
  let queryParsed = browserslist.parse(query)
  // TODO Take the most frequent region in large queries?
  let firstQueryRegion = queryParsed.find(x => x.place)
  return firstQueryRegion ? firstQueryRegion.place : null
}
