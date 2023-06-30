import { filterComments } from '../../lib/filter-comments.js'

export function configToQuery(config) {
  if (hasJSONSymbols(config)) {
    return jsonConfigToQuery(config)
  }

  return textConfigToQuery(config)
}

const JSON_FRAGMENT_REQUIRED_SYMBOLS = [':', '[', ']']

function jsonConfigToQuery(config) {
  try {
    return jsonToQuery(config)
  } catch {}
  try {
    return jsonFragmentToQuery(config)
  } catch {}

  return config
}

function textConfigToQuery(config) {
  return filterComments(config.toString())
    .split(/\n|,/)
    .filter(line => line.trim().length > 1)
}

function jsonToQuery(jsonConfig) {
  let data = JSON.parse(jsonConfig).browserslist
  return data.join(',')
}

function jsonFragmentToQuery(jsonFragment) {
  return jsonToQuery('{' + jsonFragment + '}')
}

function hasJSONSymbols(string) {
  for (let symbol of JSON_FRAGMENT_REQUIRED_SYMBOLS) {
    if (!string.includes(symbol)) {
      return false
    }
  }
  return true
}
