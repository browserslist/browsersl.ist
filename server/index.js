import http from 'http'
import browserslist from 'browserslist'
import { URL } from 'url'
import { readFileSync } from 'fs'
import { agents as caniuseAgents, region as caniuseRegion } from 'caniuse-lite'

let { version: bv } = importJSON('./node_modules/browserslist/package.json')
let { version: cv } = importJSON('./node_modules/caniuse-lite/package.json')
let wikipediaLinks = importJSON('../browsers-data/wikipedia-links.json')

const DEFAULT_QUERY = 'defaults'
const GLOBAL_REGION = 'Global'
const PORT = process.env.PORT || 5000

http
  .createServer((req, res) => {
    let url = new URL(req.url, `http://${req.headers.host}/`)

    if (url.pathname === '/') {
      try {
        let query = url.searchParams.get('q') || DEFAULT_QUERY
        let region = extractRegionFromQuery(query)

        getBrowsers(query, region)
          .then(browsers => {
            res.writeHead(200, {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'text/json'
            })
            res.write(JSON.stringify(browsers))
            res.end()
          })
          .catch(error => {
            res.writeHead(200, {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'text/json'
            })
            res.write(JSON.stringify({ error }))
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


async function getBrowsers(query = DEFAULT_QUERY, region = GLOBAL_REGION) {
  let loadBrowsersData = async (resolve, reject) => {
    let browsersByQuery = []

    try {
      let queryWithoutQuotes = query.replace(/'/g, '')
      browsersByQuery = browserslist(queryWithoutQuotes)
    } catch (e) {
      reject(e)
    }

    let browsersGroups = {};
    let browsersGroupsKeys = [];

    for (let browser of browsersByQuery) {
      if (browsersGroupsKeys.includes(browser)) {
        return;
      }

      browsersGroupsKeys.push(browser);
      let [id, version] = browser.split(' ')
      let coverage = region === GLOBAL_REGION
        ? getGlobalCoverage(id, version)
        : await getRegionCoverage(id, version, region);

      let versionData = [version, round(coverage)];

      if (!browsersGroups[id]) {
        browsersGroups[id] = { versions: [versionData] }
      } else {
        browsersGroups[id].versions.push(versionData)
      }
    }

    let browsers = Object.entries(browsersGroups).map(([id, data]) => {
      let { browser: name, usage_global: usageGlobal } = caniuseAgents[id];
      // TODO Add regional coverage
      let coverage = round(Object.values(usageGlobal).reduce((a, b) => a + b, 0))
      let wiki = wikipediaLinks[id]
      let versions = data.versions.sort((a, b) => b.coverage - a.coverage)

      return {
        id,
        name,
        wiki,
        coverage,
        versions
      }
    }).sort((a, b) => b.coverage - a.coverage);

    resolve({
      query,
      region,
      coverage: browserslist.coverage(browsersByQuery, region),
      bv,
      cv,
      browsers
    })
  };

  return new Promise(loadBrowsersData);
}

function extractRegionFromQuery(query) {
  let queryHasIn = query.match(/ in ((?:alt-)?[A-Za-z]{2})(?:,|$)/)
  return queryHasIn ? queryHasIn[1] : undefined
}

function getGlobalCoverage(id, version) {
  return getCoverage(caniuseAgents[id].usage_global, version);
}

// TODO Show region not found error if not exists
async function getRegionCoverage(id, version, region) {
  let { default: regionData } = await import(`./node_modules/caniuse-lite/data/regions/${region}.js`)
  return getCoverage(caniuseRegion(regionData)[id], version)
}

function getCoverage(data, version) {
  let [lastVersion] = Object.keys(data).sort((a, b) => Number(b) - Number(a))

  // If specific version coverage is missing, fall back to 'version zero'
  return data[version] !== undefined ? data[version] : data[lastVersion]
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function importJSON(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url)))
}
