import { filterComments } from '../../lib/filter-comments.js'

export function configToQuery(config) {
  if (hasJSONSymbols(config)) {
    return jsonConfigToQuery(config)
  }

  return rcConfigToQuery(config)
}

const JSON_FRAGMENT_REQUIRED_SYMBOLS = [':', '[', ']']

export function jsonConfigToQuery(config) {
  try {
    return JSONToQuery(config)
  } catch {}
  try {
    return JSONFragmentToQuery(config)
  } catch {}

  return config
}

export function rcConfigToQuery(config) {
  return config
    .toString()
    .split(/\n|,/)
    .map(filterComments)
    .filter(line => line !== '')
}

function JSONToQuery(jsonConfig) {
  let data = JSON.parse(jsonConfig).browserslist
  return data.join(',')
}

function JSONFragmentToQuery(jsonFragment) {
  return JSONToQuery('{' + jsonFragment + '}')
}

function hasJSONSymbols(string) {
  for (let symbol of JSON_FRAGMENT_REQUIRED_SYMBOLS) {
    if (!string.includes(symbol)) {
      return false
    }
  }
  return true
}
