import sendResponse from '../lib/send-response.js'

export default async function handleError404(req, res) {
  sendResponse(res, 404, { message: 'Not found' })
}
