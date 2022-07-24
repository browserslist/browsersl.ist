import http from 'http'
import browserslist from 'browserslist'
import { URL } from 'url'
import { readFileSync } from 'fs'
import { agents as caniuse } from 'caniuse-lite'

const { version: browserslistVersion } = importJSON(
  './node_modules/browserslist/package.json'
)
const { version: caniuseVersion } = importJSON(
  './node_modules/caniuse-lite/package.json'
)
const browsersWikipediaLinks = importJSON(
  '../browsers-data/wikipedia-links.json'
)

const DEFAULT_QUERY = 'defaults'
const DEFAULT_REGION = 'Global'
const PORT = process.env.PORT || 5000

let caniuseRegion

http
  .createServer((req, res) => {
    let url = new URL(req.url, `http://${req.headers.host}/`)

    if (url.pathname === '/') {
      let query = url.searchParams.get('q') || DEFAULT_QUERY
      let region = extractRegionFromQuery(query)

      let compatibleBrowsers = getBrowsers()
      let browsersByQuery = []

      try {
        let queryWithoutQuotes = query.replace(/'/g, '')
        browsersByQuery = browserslist(queryWithoutQuotes)
      } catch (e) {
        // TODO create middleware
        res.writeHead(400, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/json'
        })
        res.write(JSON.stringify({ status: 'error' }))
        res.end()
        return
      }

      for (let browser of browsersByQuery) {
        let [id, version] = browser.split(' ')
        let { usage_global: usageGlobal } = caniuse[id]
        // TODO sort versions by coverage, show versions only >=0.1% coverage
        // TODO if all versions do not satisfy the request, show the most popular
        compatibleBrowsers
          .find(x => x.id === id)
          .versions.push({
            version,
            coverage: region
              ? getRegionCoverage(region, id, version)
              : getCoverage(usageGlobal, version)
            // TODO inQuery flag
          })
      }

      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/json'
      })
      res.write(
        JSON.stringify({
          query,
          browserslistVersion,
          caniuseVersion,
          browsers: compatibleBrowsers,
          region: region || DEFAULT_REGION,
          coverage: browserslist.coverage(browsersByQuery, region)
        })
      )
      res.end()
    }
  })
  .listen(PORT)

function extractRegionFromQuery(query) {
  let queryHasIn = query.match(/ in ((?:alt-)?[A-Za-z]{2})(?:,|$)/)
  return queryHasIn ? queryHasIn[1] : undefined
}

function getCoverage(data, version) {
  let [lastVersion] = Object.keys(data).sort((a, b) => Number(b) - Number(a))

  // If specific version coverage is missing, fall back to 'version zero'
  return data[version] !== undefined ? data[version] : data[lastVersion]
}

function getRegionCoverage(region, id, version) {
  if (!caniuseRegion) {
    caniuseRegion = importJSON(
      `./node_modules/caniuse-lite/data/regions/${region}.json`
    )
  }

  return getCoverage(caniuseRegion.data[id], version)
}

// TODO fix perfomance (computational complexity)
function getBrowsers() {
  return Object.entries(caniuse)
    .map(([id, data]) => {
      let coverage = Object.values(data.usage_global).reduce((a, b) => a + b, 0)
      return {
        id,
        name: data.browser,
        wiki: browsersWikipediaLinks[id],
        coverage,
        versions: []
      }
    })
    .sort((a, b) => {
      if (a.coverage > b.coverage) {
        return -1
      }
      if (a.coverage < b.coverage) {
        return 1
      }
      return 0
    })
}

function importJSON(filename) {
  return JSON.parse(readFileSync(new URL(filename, import.meta.url)))
}
