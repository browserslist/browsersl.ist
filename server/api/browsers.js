import { URL } from 'url'

import getBrowsers, { QUERY_DEFAULTS } from '../lib/get-browsers.js'
import sendResponse from '../lib/send-response.js'
import { REGION_GLOBAL_KEY } from '../lib/get-regions.js'

export default async function handleBrowsers(req, res) {
  let { searchParams: params } = new URL(req.url, `http://${req.headers.host}/`)

  let query = params.get('q') || QUERY_DEFAULTS
  let queryWithoutQuotes = query
  let region = params.get('region') || REGION_GLOBAL_KEY

  try {
    sendResponse(res, 200, await getBrowsers(queryWithoutQuotes, region))
  } catch (error) {
    sendResponse(res, 400, { message: error.message })
  }
}
