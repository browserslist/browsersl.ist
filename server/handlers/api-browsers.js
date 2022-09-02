import { URL } from 'node:url'

import {
  QUERY_DEFAULTS,
  REGION_GLOBAL,
  getBrowsers
} from '../lib/get-browsers.js'
import { sendResponseAPI } from '../lib/send-response.js'

export async function handleAPIBrowsers(req, res) {
  let { searchParams: params } = new URL(req.url, `http://${req.headers.host}/`)

  let query = params.get('q') || QUERY_DEFAULTS
  let region = params.get('region') || REGION_GLOBAL

  try {
    sendResponseAPI(res, 200, await getBrowsers(query, region))
  } catch (error) {
    sendResponseAPI(res, 400, { message: error.message })
  }
}
