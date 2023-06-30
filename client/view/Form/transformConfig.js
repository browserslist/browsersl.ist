const JSON_FRAGMENT_REQUIRED_SYMBOLS = [':', '[', ']']

export function transformConfig(config) {
  if (hasJSONSymbols(config)) {
    try {
      return transformJSONToConfig(config)
    } catch {}
    try {
      return transformJSONFragmentToConfig(config)
    } catch {}
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

function hasJSONSymbols(string) {
  for (let symbol of JSON_FRAGMENT_REQUIRED_SYMBOLS) {
    if (!string.includes(symbol)) {
      return false
    }
  }
  return true
}
