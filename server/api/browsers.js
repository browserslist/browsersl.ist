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

  try {
    sendResponse(res, 200, await getBrowsers(queryWithoutQuotes))
  } catch (error) {
    sendResponse(res, 400, { message: error.message })
  }
}
