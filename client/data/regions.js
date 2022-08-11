// regions.json is created on `postinstall` step
import { continents, countryCodes } from './regions.json'

export const DEFAULT_REGION = 'alt-ww'

export const regionList = [...Object.keys(continents), ...countryCodes]

export const regionGroups = {
  continents: Object.entries(continents).map(([id, name]) => {
    return {
      id,
      name
    }
  }),
  countries: countryCodes.map(id => {
    return {
      id,
      name: getCountryName(id)
    }
  })
}

function getCountryName(id) {
  let isIntlDisplayNameSupports =
    'Intl' in window && 'DisplayNames' in window.Intl

  // Show country `id` instead country fullname for old browsers
  return isIntlDisplayNameSupports
    ? new Intl.DisplayNames(['us'], { type: 'region' }).of(id)
    : id
}
