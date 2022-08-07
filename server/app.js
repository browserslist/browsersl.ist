import http from 'node:http'
import { URL } from 'node:url'

import handleMain from './api/main.js'
import handleBrowsers from './api/browsers.js'
import handleStatic from './api/static.js'

const PORT = process.env.PORT || 5000

const App = http
  .createServer(async (req, res) => {
    let { pathname } = new URL(req.url, `http://${req.headers.host}/`)

    switch (pathname) {
      case '/':
        handleMain(req, res)
        break

      case '/api/browsers':
        handleBrowsers(req, res)
        break

      // TODO Add endpoint /api/social
      // handleSocial(req, res) : { githubStars: number, twitterFollowers: number }

      default:
        handleStatic(req, res)
        break
    }
  })
  .listen(PORT, () => {
    process.stdout.write(
      `Server listening on a port http://localhost:${PORT}/\n`
    )
  })

export default App
