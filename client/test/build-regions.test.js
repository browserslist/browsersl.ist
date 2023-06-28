import { ok } from 'node:assert'
import test from 'node:test'

import { regions } from '../scripts/build-regions.js'

test('Prebuilt `countryCodes` in regions.json contains the 4 most populated countries', () => {
  let countries = ['CN', 'ID', 'IN', 'US']
  ok(countries.every(x => regions.countryCodes.includes(x)))
})

test('Prebuilt `countryCodes` in regions.json not contains `alt-` prefix', () => {
  ok(regions.countryCodes.every(x => !x.includes('alt-')))
})
