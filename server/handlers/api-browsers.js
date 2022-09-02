import { sendResponseAPI } from '../lib/send-response.js'
import { getBrowsers } from '../lib/get-browsers.js'

export async function handleAPIBrowsers(req, res, url) {
  let query = url.searchParams.get('q') || 'defaults'
  let region = url.searchParams.get('region') || 'alt-ww'
  try {
    sendResponseAPI(res, 200, await getBrowsers(query, region))
  } catch (error) {
    sendResponseAPI(res, 400, { message: error.message })
  }
}
