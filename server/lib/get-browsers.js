import browserslist from 'browserslist'
import { readFileSync } from 'fs'
import { URL } from 'url'
import { agents as caniuseAgents, region as caniuseRegion } from 'caniuse-lite'

import getRegions, {
  REGION_GLOBAL_KEY,
  REGION_GLOBAL_VALUE
} from './get-regions.js'

let { version: bv } = importJSON('../node_modules/browserslist/package.json')
let { version: cv } = importJSON('../node_modules/caniuse-lite/package.json')

export const QUERY_DEFAULTS = 'defaults'

export default async function getBrowsers(query, region) {
  // Browserslist supports alias `Global` for region `alt-ww`
  if (region === REGION_GLOBAL_VALUE) {
    region = REGION_GLOBAL_KEY
  }

  let loadBrowsersData = async (resolve, reject) => {
    let browsersByQuery = []

    try {
      browsersByQuery = browserslist(query)
    } catch (error) {
      reject(
        error.browserslist
          ? error
          : new Error(`Unknown browser query \`${query}\`.`)
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
      let versionCoverage = null

      if (id !== 'node') {
        try {
          versionCoverage =
            region === REGION_GLOBAL_KEY
              ? getGlobalCoverage(id, version)
              : await getRegionCoverage(id, version, region)
        } catch (error) {
          reject(error)
        }
      }

      let versionData = { [`${version}`]: roundNumber(versionCoverage) }

      if (!browsersGroups[id]) {
        browsersGroups[id] = { versions: versionData }
      } else {
        // TODO Sort version keys by coverage
        Object.assign(browsersGroups[id].versions, versionData)
      }
    }

    let browsers = Object.entries(browsersGroups)
      .map(([id, { versions }]) => {
        let coverage = null
        let name
        // Node.js doesn't have coverage statistics on Can I Use
        if (id === 'node') {
          name = 'Node'
        } else {
          let { browser, usage_global: usageGlobal } = caniuseAgents[id]
          // TODO Add regional coverage
          coverage = roundNumber(
            Object.values(usageGlobal).reduce((a, b) => a + b, 0)
          )
          name = browser
        }

        return {
          id,
          name,
          coverage,
          versions
        }
      })
      .sort((a, b) => b.coverage - a.coverage)

    let coverage

    try {
      coverage = browserslist.coverage(browsersByQuery, region)
    } catch (error) {
      reject(error)
    }

    resolve({
      query,
      region,
      coverage,
      versions: {
        browserslist: bv,
        caniuse: cv
      },
      browsers
    })
  }

  return new Promise(loadBrowsersData)
}

function getGlobalCoverage(id, version) {
  return getCoverage(caniuseAgents[id].usage_global, version)
}

async function getRegionCoverage(id, version, region) {
  if (region in getRegions()) {
    let { default: regionData } = await import(
      `../node_modules/caniuse-lite/data/regions/${region}.js`
    )
    return getCoverage(caniuseRegion(regionData)[id], version)
  } else {
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
