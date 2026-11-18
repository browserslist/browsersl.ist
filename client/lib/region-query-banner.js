import { filterComments } from '../../lib/filter-comments.js'

// Same id as `DEFAULT_REGION` in `client/data/regions.js`. Kept here so
// `node --test` can load this file without the browser `window` global.
const GLOBAL_REGION = 'alt-ww'
const POPULARITY =
  /^(>=?|<=?)\s*(\d+|\d+\.\d+|\.\d+)%(?:\s+in\s+((?:alt-)?\w\w))?$/i

// Recommend only. Rewriting the query was rejected in #444 because `>1%`
// has to return the same browsers for every Region value.
export function getRegionQueryBanner(config, region, regionIds) {
  if (typeof config !== 'string') return null

  let known = regionIds ? new Set(regionIds) : null
  let country = isCountry(region, known)
  if (!country && region && region !== GLOBAL_REGION) return null

  let items = []
  let places = []
  let seen = new Set()
  for (let source of clausesFromConfig(config)) {
    let hit = inspectClause(source)
    if (!hit) continue
    let skip = country
      ? hit.place
      : !hit.place ||
        hit.place === GLOBAL_REGION ||
        (known && !known.has(hit.place))
    if (skip) continue

    let recommendation = formatQuery(hit, country ? region : hit.place)
    if (seen.has(recommendation)) continue
    seen.add(recommendation)
    let item = { source, recommendation }
    if (!country) {
      item.place = hit.place
      if (!places.includes(hit.place)) places.push(hit.place)
    }
    items.push(item)
  }

  if (items.length === 0) return null
  if (country) return { type: 'popularity-in-region', region, items }
  return { type: 'select-region', places, items }
}

function clausesFromConfig(config) {
  let text = filterComments(config)
  if (config.includes(':') && config.includes('[') && config.includes(']')) {
    try {
      let list = JSON.parse(
        config.trim().startsWith('{') ? config : `{${config}}`
      ).browserslist
      if (Array.isArray(list)) text = list.join('\n')
    } catch {}
  }

  return text
    .split(/\n|,|\s+(?:and|or)\s+/i)
    .map(part => part.trim())
    .filter(Boolean)
}

function inspectClause(clause) {
  let body = clause
  let not = false
  let notPrefix = body.match(/^not\s+(?!\s)/i)
  if (notPrefix) {
    not = true
    body = body.slice(notPrefix[0].length).trim()
  }

  let match = body.match(POPULARITY)
  if (!match) return null
  let place = match[3]
  return {
    not,
    sign: match[1],
    popularity: match[2],
    place:
      place && (place.length === 2 ? place.toUpperCase() : place.toLowerCase())
  }
}

function formatQuery(hit, place) {
  let query = `${hit.sign} ${hit.popularity}%`
  if (place) query += ` in ${place}`
  return hit.not ? `not ${query}` : query
}

function isCountry(region, known) {
  return (
    typeof region === 'string' &&
    /^[A-Z]{2}$/.test(region) &&
    (!known || known.has(region))
  )
}
