export function sendResponse(res, status, headers, data) {
  res.writeHead(status, headers)
  res.write(data)
  res.end()
}

export function sendResponseAPI(res, status, data) {
  let JSONData = JSON.stringify(data)

  res.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Content-Length': new Blob([JSONData]).size,
    'Content-Type': 'text/json'
  })
  res.write(JSONData)
  res.end()
}

export function sendError(res, status, message) {
  res.writeHead(status, {
    'Content-Type': 'text/plain'
  })
  res.end(message)
}
