import { agents as caniuseAgents, region as caniuseRegion } from 'caniuse-lite'
import { readFileSync } from 'node:fs'
import browserslist from 'browserslist'
import { URL } from 'node:url'

let { version: bv } = importJSON('../node_modules/browserslist/package.json')
let { version: cv } = importJSON('../node_modules/caniuse-lite/package.json')

export const QUERY_DEFAULTS = 'defaults'
export const REGION_GLOBAL = 'alt-ww'

export default async function getBrowsers(query, region) {
  let browsersByQuery = []

  try {
    browsersByQuery = browserslist(query)
  } catch (error) {
    throw error.browserslist
      ? error
      : new Error(`Unknown browser query \`${query}\`.`)
  }

  let browsersCoverageByQuery = {}

  for (let browser of browsersByQuery) {
    let [id, version] = browser.split(' ')
    let versionCoverage

    // The Node.js is not in the Can I Use db
    if (id === 'node') {
      versionCoverage = null
    } else {
      versionCoverage = roundNumber(
        region === REGION_GLOBAL
          ? getGlobalCoverage(id, version)
          : await getRegionCoverage(id, version, region)
      )
    }

    if (!browsersCoverageByQuery[id]) {
      browsersCoverageByQuery[id] = {}
    }

    browsersCoverageByQuery[id][version] = versionCoverage
  }

  let browsers = Object.entries(browsersCoverageByQuery)
    .map(([id, versions]) => {
      let name
      let coverage

      // The Node.js is not in the Can I Use db
      if (id === 'node') {
        name = 'Node'
        coverage = null
      } else {
        name = caniuseAgents[id].browser
        coverage = roundNumber(
          Object.values(versions).reduce((a, b) => a + b, 0)
        )
      }

      return {
        id,
        name,
        coverage,
        versions
      }
    })
    .sort((a, b) => b.coverage - a.coverage)

  let coverage = roundNumber(browserslist.coverage(browsersByQuery, region))

  return {
    query,
    region,
    coverage,
    versions: {
      browserslist: bv,
      caniuse: cv
    },
    browsers
  }
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
      `caniuse-lite/data/regions/${region}.js`
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
