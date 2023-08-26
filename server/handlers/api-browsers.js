import { getBrowsers } from '../lib/get-browsers.js'
import { sendResponseAPI } from '../lib/send-response.js'

export async function handleAPIBrowsers(req, res, url) {
  let config = url.searchParams.get('q') || 'defaults'

  // Specify the default global region as `null`, not `alt-ww`
  // `caniuse-db` has differences between stats data (https://github.com/Fyrd/caniuse/issues/6811):
  // `usage_global` in `data.json` is updated daily/weekly, `region-usage-json/alt-ww.json` is updated monthly
  let region = url.searchParams.get('region') || null

  try {
    sendResponseAPI(res, 200, await getBrowsers(config, region))
  } catch (error) {
    sendResponseAPI(res, 400, { message: error.message })
  }
}
