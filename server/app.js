import http from 'http'
import { URL } from 'url'

import handleBrowsers from './api/browsers.js'
import handleRegion from './api/regions.js'
import handleError404 from './api/error404.js'

const PORT = process.env.PORT || 5000

const App = http
  .createServer(async (req, res) => {
    let { pathname } = new URL(req.url, `http://${req.headers.host}/`)

    switch (pathname) {
      case '/api/browsers':
        handleBrowsers(req, res)
        break

      case '/api/regions':
        handleRegion(req, res)
        break

      // TODO Add endpoint /api/social
      // handleSocial(req, res) : { githubStars: number, twitterFollowers: number }

      default:
        handleError404(req, res)
        break
    }
  })
  .listen(PORT)

export default App
