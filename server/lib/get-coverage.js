import browserslist from 'browserslist'
import { agents as caniuseAgents, region as caniuseRegion } from 'caniuse-lite'

const REGION_NAME = /^(alt-)?[A-Za-z]{2}$/

export function getTotalCoverage(browsers, region) {
  let isGlobal = !region
  let coverage = isGlobal
    ? browserslist.coverage(browsers)
    : browserslist.coverage(browsers, region)

  // BUG `caniuse-db` returns coverage >100% https://github.com/Fyrd/caniuse/issues/6426
  coverage = coverage > 100 ? 100 : coverage

  return round(coverage)
}

export function getTotalBrowserCoverage(versions) {
  let browserVerStats = Object.values(versions)
  return round(browserVerStats.reduce((sum, x) => sum + x, 0))
}

export async function getBrowserVersionCoverage(id, version, region) {
  let isGlobal = !region
  if (isGlobal) {
    return parseBrowserVersionCoverage(caniuseAgents[id].usage_global, version)
  }

  try {
    if (!REGION_NAME.test(region)) {
      throw new Error(`Invalid symbols in region name \`${region}\`.`)
    }

    let { default: regionData } = await import(
      `caniuse-lite/data/regions/${region}.js`
    )
    return parseBrowserVersionCoverage(caniuseRegion(regionData)[id], version)
  } catch (e) {
    throw new Error(`Unknown region name \`${region}\`.`)
  }
}

function parseBrowserVersionCoverage(stats, ver) {
  let [lastVer] = Object.keys(stats).sort((a, b) => Number(b) - Number(a))

  // If specific version coverage is missing, fall back to 'version zero'
  let coverage = stats[ver] !== undefined ? stats[ver] : stats[lastVer]
  return round(coverage)
}

function round(value) {
  return Math.round(value * 100) / 100
}
