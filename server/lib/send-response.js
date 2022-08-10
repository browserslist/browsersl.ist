export function sendResponse(res, status, headers, data) {
  res.writeHead(status, headers)
  res.write(data)
  res.end()
}

export function sendResponseAPI(res, status, data) {
  res.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/json'
  })
  res.write(JSON.stringify(data))
  res.end()
}

export function sendResponseError(res, status, message) {
  res.writeHead(status, { 'Content-Type': 'text/plain' })
  res.end(message)
}
