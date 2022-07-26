import browserslist from 'browserslist'
import { readFileSync } from 'fs'
import { URL } from 'url'
import { agents as caniuseAgents, region as caniuseRegion } from 'caniuse-lite'

let { version: bv } = importJSON('./node_modules/browserslist/package.json')
let { version: cv } = importJSON('./node_modules/caniuse-lite/package.json')
let wikipediaLinks = importJSON('../browsers-data/wikipedia-links.json')

export default async function getBrowsers(query, region) {
  // TODO Add support `Node > 0` query
  let loadBrowsersData = async (resolve, reject) => {
    let browsersByQuery = []

    try {
      browsersByQuery = browserslist(query)
    } catch (e) {
      reject(e)
    }

    let browsersGroups = {}
    let browsersGroupsKeys = []

    for (let browser of browsersByQuery) {
      if (browsersGroupsKeys.includes(browser)) {
        return
      }

      browsersGroupsKeys.push(browser)
      let [id, version] = browser.split(' ')
      let coverage = region
        ? getGlobalCoverage(id, version)
        : await getRegionCoverage(id, version, region)

      let versionData = [version, roundNumber(coverage)]

      if (!browsersGroups[id]) {
        browsersGroups[id] = { versions: [versionData] }
      } else {
        browsersGroups[id].versions.push(versionData)
      }
    }

    let browsers = Object.entries(browsersGroups)
      .map(([id, data]) => {
        let { browser: name, usage_global: usageGlobal } = caniuseAgents[id]
        // TODO Add regional coverage
        let coverage = roundNumber(
          Object.values(usageGlobal).reduce((a, b) => a + b, 0)
        )
        let wiki = wikipediaLinks[id]
        let versions = data.versions.sort((a, b) => b.coverage - a.coverage)

        return {
          id,
          name,
          wiki,
          coverage,
          versions
        }
      })
      .sort((a, b) => b.coverage - a.coverage)

    resolve({
      query,
      region,
      coverage: browserslist.coverage(browsersByQuery, region),
      bv,
      cv,
      browsers
    })
  }

  return new Promise(loadBrowsersData)
}

function getGlobalCoverage(id, version) {
  return getCoverage(caniuseAgents[id].usage_global, version)
}

// TODO Show region not found error if not exists
async function getRegionCoverage(id, version, region) {
  let { default: regionData } = await import(
    `./node_modules/caniuse-lite/data/regions/${region}.js`
  )
  return getCoverage(caniuseRegion(regionData)[id], version)
}

function getCoverage(data, version) {
  let [lastVersion] = Object.keys(data).sort((a, b) => Number(b) - Number(a))

  // If specific version coverage is missing, fall back to 'version zero'
  return data[version] !== undefined ? data[version] : data[lastVersion]
}

function roundNumber(value) {
  return Math.round(value * 100) / 100
}

function importJSON(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url)))
}
