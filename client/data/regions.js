// regions.json is created on `postinstall` step
import { continents, countryCodes } from './regions.json'

export const DEFAULT_REGION = 'alt-ww'

export const regionList = [...Object.keys(continents), ...countryCodes]

let getCountryName, sorter
if ('Intl' in window && 'DisplayNames' in window.Intl) {
  let namer = new Intl.DisplayNames('en-US', { type: 'region' })
  sorter = new Intl.Collator('en-US')
  getCountryName = id => namer.of(id)
} else {
  sorter = {
    compare: () => 0
  }
  getCountryName = id => id
}

export const regionGroups = {
  continents: Object.entries(continents)
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => {
      if (a.name === 'Global') {
        return -1
      } else if (b.name === 'Global') {
        return 1
      } else {
        return sorter.compare(a.name, b.name)
      }
    }),
  countries: countryCodes
    .map(id => ({ id, name: getCountryName(id) }))
    .sort((a, b) => sorter.compare(a.name, b.name))
}
