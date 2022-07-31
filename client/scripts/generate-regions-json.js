import fs from 'fs'

const DATA_REGION_FILE = 'data/regions.json'
const REGIONS_LIST_PATH = 'node_modules/caniuse-lite/data/regions'

const regions = {
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

fs.writeFileSync(DATA_REGION_FILE, JSON.stringify(regions))
process.stdout.write(`A file "client/${DATA_REGION_FILE}" with regions has been created\n`)

function getCaniuseCountries() {
  let regionCodes = fs
    .readdirSync(REGIONS_LIST_PATH)
    .map(file => file.split('.js')[0])

  return regionCodes
    .filter(regionCode => {
      let isContinentCode = regionCode.includes('alt-')
      return !isContinentCode
    })
    .sort((a, b) => b - a)
}
