const JSON_FRAGMENT_REQUIRED_SYMBOLS = [':', '[', ']']

export function transformQuery(rawQuery) {
  let query = rawQuery.trim()

  if (hasJSONSymbols(query)) {
    try {
      return transformJSONToQuery(query)
    } catch {}
    try {
      return transformJSONFragmentToQuery(query)
    } catch {}
  }

  if (query.includes('\n')) {
    return transformMultilineToQuery(query)
  }

  return query
}

function transformJSONToQuery(query) {
  let data = JSON.parse(query).browserslist
  return data.join(',')
}

function transformJSONFragmentToQuery(query) {
  return transformJSONToQuery('{' + query + '}')
}

// TODO Use a parser from the browserslist API
function transformMultilineToQuery(query) {
  // Replace newline to browserslist `or`. Support `,` at end of line
  return query.replace(/\n|,+\n/g, ',')
}

function hasJSONSymbols(query) {
  for (let symbol of JSON_FRAGMENT_REQUIRED_SYMBOLS) {
    if (!query.includes(symbol)) {
      return false
    }
  }
  return true
}
