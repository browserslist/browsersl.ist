import { writeFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')

const DATA_REGION_FILE = join(ROOT, 'data/regions.json')
const REGIONS_LIST_PATH = join(ROOT, 'node_modules/caniuse-lite/data/regions')

function getCaniuseCountries() {
  let regionCodes = readdirSync(REGIONS_LIST_PATH).map(f => f.split('.js')[0])

  return regionCodes
    .filter(regionCode => {
      let isContinentCode = regionCode.includes('alt-')
      return !isContinentCode
    })
    .sort((a, b) => b - a)
}

let regions = {
  continents: {
    'alt-ww': 'Global',
    'alt-af': 'Africa',
    'alt-an': 'Antarctica',
    'alt-as': 'Asia',
    'alt-eu': 'Europe',
    'alt-na': 'North America',
    'alt-oc': 'Oceania',
    'alt-sa': 'South America'
  },
  countryCodes: getCaniuseCountries()
}

writeFileSync(DATA_REGION_FILE, JSON.stringify(regions))
process.stdout.write(
  `A file "client/${DATA_REGION_FILE}" with regions has been created\n`
)
