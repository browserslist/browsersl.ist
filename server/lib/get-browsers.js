import browserslist from 'browserslist'
import { lint } from 'browserslist-lint'
import { agents as caniuseAgents } from 'caniuse-lite'
import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { getBrowserVersionCoverage, getTotalCoverage } from './get-coverage.js'
import { configToQuery } from './parse-config.js'

const ROOT = fileURLToPath(import.meta.url)

let bv = importJSON('../node_modules/browserslist/package.json').version
let cv = importJSON('../node_modules/caniuse-lite/package.json').version
let updated = statSync(join(ROOT, '../../../pnpm-lock.yaml')).mtime

export async function getBrowsers(config, region) {
  let browsersByQuery = []
  let query = configToQuery(config)

  try {
    browsersByQuery = browserslist(query)
  } catch (error) {
    throw error.browserslist
      ? error
      : new Error(`Unknown browser query \`${config}\`.`)
  }

  let browsersCoverageByQuery = {}

  for (let browser of browsersByQuery) {
    let [id, version] = browser.split(' ')
    let versionCoverage

    // The Node.js is not in the Can I Use db
    if (id === 'node') {
      versionCoverage = null
    } else {
      versionCoverage = await getBrowserVersionCoverage(id, version, region)
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
        coverage = Object.values(versions).reduce((a, b) => a + b, 0)
      }

      return {
        coverage,
        id,
        name,
        versions
      }
    })
    .sort((a, b) => b.coverage - a.coverage)

  return {
    browsers,
    config,
    coverage: getTotalCoverage(browsersByQuery, region),
    lint: lint(query),
    region,
    updated: updated.getTime(),
    versions: {
      browserslist: bv,
      caniuse: cv
    }
  }
}

function importJSON(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url)))
}
