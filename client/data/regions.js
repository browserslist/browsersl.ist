// regions.json is created on `postinstall` step
import { continents, countryCodes } from './regions.json'

export const DEFAULT_REGION = 'alt-ww'

export const regionList = [...Object.keys(continents), ...countryCodes]

let comparer = new Intl.Collator('en-US')

let getCountryName
if ('Intl' in window && 'DisplayNames' in window.Intl) {
  let namer = new Intl.DisplayNames('en-US', { type: 'region' })
  getCountryName = id => namer.of(id)
} else {
  getCountryName = id => id
}

export const regionGroups = {
  continents: Object.entries(continents).map(([id, name]) => ({ id, name })),
  countries: countryCodes
    .map(id => ({ id, name: getCountryName(id) }))
    .sort((a, b) => comparer.compare(a.name, b.name))
}
