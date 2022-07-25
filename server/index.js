import http from 'http'
import browserslist from 'browserslist'
import { URL } from 'url'
import { readFileSync } from 'fs'
import {
  agents as caniuseAgents,
  region as caniuseUnpackRegion
} from 'caniuse-lite'

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

http
  .createServer((req, res) => {
    let url = new URL(req.url, `http://${req.headers.host}/`)

    if (url.pathname === '/') {
      try {
        let query = url.searchParams.get('q') || DEFAULT_QUERY
        let region = extractRegionFromQuery(query)

        getBrowsers(query, region).then((browsers) => {
          res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/json'
          })
          res.write(JSON.stringify(browsers))
          res.end()
        })
      } catch (e) {
        // TODO create middleware
        res.writeHead(500, {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/json'
        })
        res.write(JSON.stringify({ error: 'Internal Server Error' }))
        res.end()
      }
    }
  })
  .listen(PORT)

function extractRegionFromQuery(query) {
  let queryHasIn = query.match(/ in ((?:alt-)?[A-Za-z]{2})(?:,|$)/)
  return queryHasIn ? queryHasIn[1] : undefined
}

async function getBrowsers(query = DEFAULT_QUERY, region = DEFAULT_REGION) {
  let loadBrowsers = async (resolve, reject) => {
    let queryWithoutQuotes = query.replace(/'/g, '')
    let browsersByQuery = [];
    let error = '';

    try {
      browsersByQuery = browserslist(queryWithoutQuotes)
    } catch (e) {
    }

    // TODO fix perfomance (computational complexity)
    let allBrowsers = Object.entries(caniuseAgents)
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

    for (let browser of browsersByQuery) {
      let [id, version] = browser.split(' ')
      let { usage_global: usageGlobal } = caniuseAgents[id]
      let versionData = {
        version,
        coverage: region !== DEFAULT_REGION
          ? await getRegionCoverage(region, id, version)
          : getCoverage(usageGlobal, version)
      }

      let { versions } = allBrowsers.find(x => x.id === id)
      versions.push(versionData)
    }

    resolve({
      query,
      error,
      region: region || DEFAULT_REGION,
      browserslistVersion,
      caniuseVersion,
      browsers: allBrowsers,
      coverage: browserslist.coverage(browsersByQuery, region)
    });
  };
  return new Promise(loadBrowsers);
}

function getCoverage(data, version) {
  let [lastVersion] = Object.keys(data).sort((a, b) => Number(b) - Number(a))

  // If specific version coverage is missing, fall back to 'version zero'
  return data[version] !== undefined ? data[version] : data[lastVersion]
}

async function getRegionCoverage(region, id, version) {
  let loadRegion = async (resolve) => {
    let { default: regionData } = await import(
      `./node_modules/caniuse-lite/data/regions/${region}.js`
    );
    resolve(regionData);
  };
  let regionData = await new Promise(loadRegion);
  return getCoverage(caniuseUnpackRegion(regionData)[id], version)
}

function importJSON(filename) {
  return JSON.parse(readFileSync(new URL(filename, import.meta.url)))
}
