import http from 'node:http'
import { URL } from 'node:url'

import handleMain from './handlers/main.js'
import handleAPIBrowsers from './handlers/api-browsers.js'
import handleStatic from './handlers/static.js'

const PORT = process.env.PORT || 5000

const App = http.createServer(async (req, res) => {
  let { pathname } = new URL(req.url, `http://${req.headers.host}/`)

  switch (pathname) {
    case '/':
      handleMain(req, res)
      break

    case '/api/browsers':
      handleAPIBrowsers(req, res)
      break

    // TODO Add endpoint /api/social
    // handleAPISocial(req, res) : { githubStars: number, twitterFollowers: number }

    default:
      handleStatic(req, res)
      break
  }
})

App.listen(PORT, () => {
  process.stdout.write(`Server listening on a port http://localhost:${PORT}/\n`)
})

export default App
