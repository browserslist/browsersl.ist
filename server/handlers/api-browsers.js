import { getBrowsers } from '../lib/get-browsers.js'
import { sendResponseAPI } from '../lib/send-response.js'

export async function handleAPIBrowsers(req, res, url) {
  let config = url.searchParams.get('q') || 'defaults'
  let region = url.searchParams.get('region') || 'alt-ww'
  let region = url.searchParams.get('region') || null

  try {
    sendResponseAPI(res, 200, await getBrowsers(config, region))
  } catch (error) {
    sendResponseAPI(res, 400, { message: error.message })
  }
}
