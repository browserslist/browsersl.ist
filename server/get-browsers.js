import browserslist from 'browserslist'
import { readFileSync } from 'fs'
import { URL } from 'url'
import { agents as caniuseAgents, region as caniuseRegion } from 'caniuse-lite'

let { version: bv } = importJSON('./node_modules/browserslist/package.json')
let { version: cv } = importJSON('./node_modules/caniuse-lite/package.json')

const GLOBAL_REGION = 'Global'

export default async function getBrowsers(query) {
  let region = parseRegionFromQuery(query) || GLOBAL_REGION

  // TODO Add support `Node > 0` query
  let loadBrowsersData = async (resolve, reject) => {
    let browsersByQuery = []

    try {
      browsersByQuery = browserslist(query)
    } catch (error) {
      reject(
        error.browserslist
          ? error.message
          : `Unknown browser query \`${query}\`.`
      )
      return
    }

    let browsersGroups = {}
    let browsersGroupsKeys = []

    for (let browser of browsersByQuery) {
      if (browsersGroupsKeys.includes(browser)) {
        return
      }

      browsersGroupsKeys.push(browser)
      let [id, version] = browser.split(' ')
      let versionCoverage =
        region === GLOBAL_REGION
          ? getGlobalCoverage(id, version)
          : await getRegionCoverage(id, version, region)

      let versionData = { [`${version}`]: roundNumber(versionCoverage) }

      if (!browsersGroups[id]) {
        browsersGroups[id] = { versions: versionData }
      } else {
        Object.assign(browsersGroups[id].versions, versionData)
      }
    }

    let browsers = Object.entries(browsersGroups)
      .map(([id, { versions }]) => {
        let { browser: name, usage_global: usageGlobal } = caniuseAgents[id]
        // TODO Add regional coverage
        let coverage = roundNumber(
          Object.values(usageGlobal).reduce((a, b) => a + b, 0)
        )

        return {
          id,
          name,
          coverage,
          versions
        }
      })
      .sort((a, b) => b.coverage - a.coverage)

    resolve({
      query,
      region,
      coverage: browserslist.coverage(browsersByQuery, region),
      versions: {
        browserslist: bv,
        caniuse: cv
      },
      browsers
    })
  }

  return new Promise(loadBrowsersData)
}

function parseRegionFromQuery(query) {
  let queryParsed = browserslist.parse(query)
  // TODO Take the most frequent region in large queries?
  let firstQueryRegion = queryParsed.find(x => x.place)
  return firstQueryRegion ? firstQueryRegion.place : null
}

function getGlobalCoverage(id, version) {
  return getCoverage(caniuseAgents[id].usage_global, version)
}

async function getRegionCoverage(id, version, region) {
  try {
    if (region.includes('/')) {
      throw new Error(`Invalid symbols in region name \`${region}\`.`)
    }

    let { default: regionData } = await import(
      `./node_modules/caniuse-lite/data/regions/${region}.js`
    )
    return getCoverage(caniuseRegion(regionData)[id], version)
  } catch (e) {
    throw new Error(`Unknown region name \`${region}\`.`)
  }
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
