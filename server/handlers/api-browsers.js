import { URL } from 'node:url'

import { sendResponseAPI } from '../lib/send-response.js'
import { getBrowsers } from '../lib/get-browsers.js'

export async function handleAPIBrowsers(req, res) {
  let { searchParams: params } = new URL(req.url, `http://${req.headers.host}/`)

  let query = params.get('q') || 'defaults'
  let region = params.get('region') || 'alt-ww'

  try {
    sendResponseAPI(res, 200, await getBrowsers(query, region))
  } catch (error) {
    sendResponseAPI(res, 400, { message: error.message })
  }
}
