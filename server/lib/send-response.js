export default function sendResponse(res, status, data) {
  res.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/json'
  })
  res.write(JSON.stringify(data))
  res.end()
}
