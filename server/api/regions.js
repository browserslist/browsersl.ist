import getRegions from '../lib/get-regions.js'
import sendResponse from '../lib/send-response.js'

export default async function handleRegion(req, res) {
  try {
    sendResponse(res, 200, getRegions())
  } catch (error) {
    sendResponse(res, 400, { message: 'The list of regions is not available' })
  }
}
