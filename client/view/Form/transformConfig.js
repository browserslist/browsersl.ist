const JSON_FRAGMENT_REQUIRED_SYMBOLS = [':', '[', ']']

export function transformConfig(rawConfig) {
  let config = rawConfig.trim()

  if (hasJSONSymbols(config)) {
    try {
      return transformJSONToConfig(config)
    } catch {}
    try {
      return transformJSONFragmentToConfig(config)
    } catch {}
  }

  if (config.includes('\n') && !config.includes('#')) {
    return transformMultilineToQuery(config)
  }

  return config
}

function transformJSONToConfig(jsonConfig) {
  let data = JSON.parse(jsonConfig).browserslist
  return data.join(',')
}

function transformJSONFragmentToConfig(jsonFragment) {
  return transformJSONToConfig('{' + jsonFragment + '}')
}

// TODO Use a parser from the browserslist API
function transformMultilineToQuery(query) {
  // Replace newline to browserslist `or`. Support `,` at end of line
  return query.replace(/\n|,+\n/g, ',')
}

function hasJSONSymbols(string) {
  for (let symbol of JSON_FRAGMENT_REQUIRED_SYMBOLS) {
    if (!string.includes(symbol)) {
      return false
    }
  }
  return true
}
