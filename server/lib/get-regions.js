import fs from 'fs'

export const REGION_GLOBAL_KEY = 'alt-ww'
export const REGION_GLOBAL_VALUE = 'Global'

const CONTINENTS_LIST = {
  [`${REGION_GLOBAL_KEY}`]: REGION_GLOBAL_VALUE,
  'alt-af': 'Africa',
  'alt-an': 'Antarctica',
  'alt-as': 'Asia',
  'alt-eu': 'Europe',
  'alt-na': 'North America',
  'alt-oc': 'Oceania',
  'alt-sa': 'South America'
}

const REGION_CODES_AVAILABLE_LIST = fs
  .readdirSync('node_modules/caniuse-lite/data/regions')
  .map(fileName => fileName.split('.js')[0])

const COUNTRIES_LIST = new Intl.DisplayNames(['us'], { type: 'region' })

export default function getRegions() {
  let countries = REGION_CODES_AVAILABLE_LIST.filter(regionCode => {
    let isContinentCode = regionCode.includes('alt-')
    return !isContinentCode
  })
    .sort((a, b) => b - a)
    .map(countryCode => {
      return [countryCode, COUNTRIES_LIST.of(countryCode)]
    })

  return {
    ...CONTINENTS_LIST,
    ...Object.fromEntries(countries)
  }
}
