import { agents as caniuseAgents, region as caniuseRegion } from 'caniuse-lite'
import { readFileSync } from 'node:fs'
import browserslist from 'browserslist'
import { URL } from 'node:url'

let { version: bv } = importJSON('../node_modules/browserslist/package.json')
let { version: cv } = importJSON('../node_modules/caniuse-lite/package.json')

export const QUERY_DEFAULTS = 'defaults'
export const REGION_GLOBAL = 'Global'

export default async function getBrowsers(query, region) {
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
            region === REGION_GLOBAL
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
        Object.assign(browsersGroups[id].versions, versionData)
      }
    }

    let browsers = Object.entries(browsersGroups)
      .map(([id, { versions }]) => {
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

    let coverage

    try {
      coverage = roundNumber(browserslist.coverage(browsersByQuery, region))
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
  try {
    if (region.includes('/')) {
      throw new Error(`Invalid symbols in region name \`${region}\`.`)
    }

    let { default: regionData } = await import(
      `../node_modules/caniuse-lite/data/regions/${region}.js`
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
