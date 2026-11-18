import { deepEqual, equal } from 'node:assert'
import test from 'node:test'

import { getRegionQueryBanner } from '../lib/region-query-banner.js'

const COUNTRIES = ['US', 'FR', 'DE', 'JP', 'IT', 'CA']
const CONTINENTS = [
  'alt-af',
  'alt-an',
  'alt-as',
  'alt-eu',
  'alt-na',
  'alt-oc',
  'alt-sa',
  'alt-ww'
]

test('country and a global popularity query recommends `in REGION`', () => {
  let cases = [
    ['>= 1%', '>= 1% in FR'],
    ['>=1%', '>= 1% in FR'],
    ['> 1%', '> 1% in FR'],
    ['>1%', '> 1% in FR'],
    ['>=  1%', '>= 1% in FR'],
    ['>   1%', '> 1% in FR'],
    ['>=\t1%', '>= 1% in FR'],
    ['> 0.5%', '> 0.5% in FR'],
    ['>= .5%', '>= .5% in FR'],
    ['< 1%', '< 1% in FR'],
    ['<=1%', '<= 1% in FR']
  ]

  for (let [source, recommendation] of cases) {
    let banner = getRegionQueryBanner(source, 'FR', COUNTRIES)
    equal(banner?.type, 'popularity-in-region', source)
    equal(banner.region, 'FR', source)
    equal(banner.items[0].source, source.trim(), source)
    equal(banner.items[0].recommendation, recommendation, source)
    equal('fixed' in banner, false, source)
  }
})

test('Global and a plain popularity query does not show the first banner', () => {
  for (let query of ['>= 1%', '>=1%', '> 1%', '>1%', '>=  0.2%']) {
    equal(getRegionQueryBanner(query, 'alt-ww'), null, query)
    equal(getRegionQueryBanner(query, null), null, query)
    equal(getRegionQueryBanner(query, ''), null, query)
  }
})

test('a continent is not treated as a country', () => {
  for (let region of CONTINENTS) {
    equal(getRegionQueryBanner('>= 1%', region), null, region)
    equal(getRegionQueryBanner('>1%', region), null, region)
    equal(
      getRegionQueryBanner('>=  1%', region, COUNTRIES.concat(CONTINENTS)),
      null,
      region
    )
  }
})

test('a query that already has `in REGION` does not get the first banner', () => {
  let queries = [
    '>= 1% in US',
    '>=1% in FR',
    '> 1% in alt-as',
    '>1% in us',
    '>=  1% in  DE',
    '< 1% in JP',
    'not >= 1% in US'
  ]
  for (let query of queries) {
    equal(getRegionQueryBanner(query, 'FR'), null, query)
    equal(getRegionQueryBanner(query, 'US', COUNTRIES), null, query)
  }
})

test('`in REGION` with Region Global suggests changing the selector', () => {
  let cases = [
    ['>= 1% in US', 'US', '>= 1% in US'],
    ['>=1% in US', 'US', '>= 1% in US'],
    ['> 1% in US', 'US', '> 1% in US'],
    ['>1% in FR', 'FR', '> 1% in FR'],
    ['>=  1% in  US', 'US', '>= 1% in US'],
    ['> 0.5% in de', 'DE', '> 0.5% in DE'],
    ['>= 1% in alt-AS', 'alt-as', '>= 1% in alt-as'],
    ['< 1% in US', 'US', '< 1% in US'],
    ['<= 1% in US', 'US', '<= 1% in US'],
    ['not > 1% in jp', 'JP', 'not > 1% in JP']
  ]

  for (let [source, place, recommendation] of cases) {
    let banner = getRegionQueryBanner(
      source,
      'alt-ww',
      COUNTRIES.concat(CONTINENTS)
    )
    equal(banner?.type, 'select-region', source)
    deepEqual(banner.places, [place], source)
    equal(banner.items[0].source, source.trim(), source)
    equal(banner.items[0].recommendation, recommendation, source)
    equal(banner.items[0].place, place, source)
  }
})

test('an in-region query does not suggest Global when the selector is already Global', () => {
  equal(getRegionQueryBanner('>= 1% in alt-ww', 'alt-ww'), null)
  equal(getRegionQueryBanner('>1% in ALT-WW', null), null)
})

test('non-popularity queries do not produce a banner', () => {
  let queries = [
    'defaults',
    'last 2 versions',
    'chrome >= 100',
    'not dead',
    'cover 80%',
    'cover 80% in US',
    '>= 1% in my stats',
    '>1% in my stats',
    '>= 1% in US stats',
    'firefox esr'
  ]
  for (let query of queries) {
    equal(getRegionQueryBanner(query, 'FR'), null, query)
    equal(getRegionQueryBanner(query, 'alt-ww'), null, query)
  }
})

test('popularity clauses combined with other queries are still detected', () => {
  let country = getRegionQueryBanner('> 0.2% and not dead', 'IT')
  equal(country.type, 'popularity-in-region')
  deepEqual(
    country.items.map(item => item.recommendation),
    ['> 0.2% in IT']
  )

  let either = getRegionQueryBanner('>= 1% or last 2 versions', 'CA')
  deepEqual(
    either.items.map(item => item.recommendation),
    ['>= 1% in CA']
  )

  let lines = getRegionQueryBanner('>= 1%\n> 5%\nlast 2 versions', 'US')
  deepEqual(
    lines.items.map(item => item.recommendation),
    ['>= 1% in US', '> 5% in US']
  )
})

test('`not` stays on the recommended popularity query', () => {
  let banner = getRegionQueryBanner('not >=1%', 'JP')
  equal(banner.items[0].recommendation, 'not >= 1% in JP')
  equal(banner.items[0].source, 'not >=1%')
})

test('comments and JSON configs use the same queries the server runs', () => {
  let commented = getRegionQueryBanner('>= 1% # global\n# > 5%', 'US')
  deepEqual(
    commented.items.map(item => item.recommendation),
    ['>= 1% in US']
  )

  let json = getRegionQueryBanner(
    '{"browserslist":[">= 1%", "last 2 versions"]}',
    'CA'
  )
  equal(json.type, 'popularity-in-region')
  deepEqual(
    json.items.map(item => item.recommendation),
    ['>= 1% in CA']
  )
})

test('repeated popularity clauses recommend one query', () => {
  let banner = getRegionQueryBanner('>=1%, >= 1%', 'FR')
  equal(banner.items.length, 1)
  equal(banner.items[0].recommendation, '>= 1% in FR')
})

test('a plain clause beside `in REGION` is recommended on its own', () => {
  let banner = getRegionQueryBanner('>= 1%, >= 2% in US', 'FR')
  equal(banner.type, 'popularity-in-region')
  deepEqual(
    banner.items.map(item => item.recommendation),
    ['>= 1% in FR']
  )

  let global = getRegionQueryBanner('>= 1%, >= 2% in US', 'alt-ww', COUNTRIES)
  equal(global.type, 'select-region')
  deepEqual(global.places, ['US'])
  deepEqual(
    global.items.map(item => item.recommendation),
    ['>= 2% in US']
  )
})

test('several regions in one query are all suggested when the selector is Global', () => {
  let banner = getRegionQueryBanner(
    '>= 1% in US, > 2% in DE',
    'alt-ww',
    COUNTRIES
  )
  deepEqual(banner.places, ['US', 'DE'])
  deepEqual(
    banner.items.map(item => item.recommendation),
    ['>= 1% in US', '> 2% in DE']
  )
})

test('unknown region codes are not suggested when the selector list is known', () => {
  let known = COUNTRIES.concat(CONTINENTS)
  equal(getRegionQueryBanner('>= 1% in ZZ', 'alt-ww', known), null)
  equal(getRegionQueryBanner('>= 1%', 'ZZ', known), null)
})

test('empty configs do not produce a banner', () => {
  equal(getRegionQueryBanner('', 'FR'), null)
  equal(getRegionQueryBanner('   ', 'FR'), null)
  equal(getRegionQueryBanner('# only a comment', 'US'), null)
})
