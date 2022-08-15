import http from 'node:http'
import { URL } from 'node:url'

import handleMain from './handlers/main.js'
import handleAPIBrowsers from './handlers/api-browsers.js'
import handleStatic from './handlers/static.js'

const PORT = process.env.PORT || 3000

const App = http.createServer(async (req, res) => {
  if (req.headers.host.startsWith('www.')) {
    let noWww = req.headers.host.slice(4)
    res.writeHead(301, { Location: 'https://' + noWww + req.url })
    res.end()
    return
  }

  let { pathname } = new URL(req.url, `http://${req.headers.host}/`)
  switch (pathname) {
    case '/':
      handleMain(req, res)
      break

    case '/api/browsers':
      handleAPIBrowsers(req, res)
      break

    default:
      handleStatic(req, res)
      break
  }
})

App.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    process.stdout.write(`Server listening at http://localhost:${PORT}/\n`)
  }
})

export default App
