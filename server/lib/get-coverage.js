import browserslist from 'browserslist'
import { agents as caniuseAgents, region as caniuseRegion } from 'caniuse-lite'

export function getTotalCoverage(browsers, region) {
  let isGlobal = !region
  let coverage = isGlobal
    ? browserslist.coverage(browsers)
    : browserslist.coverage(browsers, region)

  // BUG `caniuse-db` returns coverage >100% https://github.com/Fyrd/caniuse/issues/6426
  coverage = coverage > 100 ? 100 : coverage

  return roundNumber(coverage)
}

export async function getBrowserVersionCoverage(id, version, region) {
  let isGlobal = !region
  if (isGlobal) {
    return parseBrowserVersionCoverage(caniuseAgents[id].usage_global, version)
  }

  try {
    if (region.includes('/')) {
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
  return roundNumber(coverage)
}

function roundNumber(value) {
  return Math.round(value * 100) / 100
}
