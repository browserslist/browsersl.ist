import { regionGroups } from '../../data/regions.js'
import { getRegionQueryBanner } from '../../lib/region-query-banner.js'
import { createTag } from '../../lib/utils.js'
import { buildSuggestion } from '../Alert/Alert.js'

export function showRegionQueryBanner({
  messages,
  form,
  config,
  region,
  regionIds
}) {
  let banner = getRegionQueryBanner(config, region, regionIds)
  if (!banner) return

  let queries = banner.items.map(item => item.recommendation).join(' and ')
  let suggestion = buildSuggestion(messages, description => {
    if (banner.type === 'popularity-in-region') {
      description.append(`Region is ${regionLabel(banner.region)}. Try `)
      description.append(createTag('strong', [], queries))
      description.append('.')
      return
    }
    description.append(createTag('strong', [], queries))
    description.append(
      `. Region is Global. Choose ${banner.places.map(regionLabel).join(' or ')} in the Region selector.`
    )
  })
  form.addEventListener('submit', () => suggestion.remove(), { once: true })
}

function regionLabel(id) {
  for (let group of [regionGroups.continents, regionGroups.countries]) {
    for (let region of group) {
      if (region.id === id) return region.name
    }
  }
  return id
}
