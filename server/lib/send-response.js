export function sendResponse(res, status, headers, data) {
  res.writeHead(status, headers)
  res.write(data)
  res.end()
}

export function sendResponseAPI(res, status, data) {
  let JSONData = JSON.stringify(data)

  res.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/json',
    'Content-Length': new Blob([JSONData]).size
  })
  res.write(JSONData)
  res.end()
}

export function sendResponseError(res, status, message) {
  res.writeHead(status, {
    'Content-Type': 'text/plain'
  })
  res.end(message)
}
