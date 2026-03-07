export async function handleHealth(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('OK\n')
}
