import { test } from 'uvu'
import { equal, ok } from 'uvu/assert'

import getRegions from '../lib/get-regions.js'

test('Shows continent', async () => {
  let regions = getRegions()
  equal(regions['alt-ww'], 'Global')
  equal(regions['alt-af'], 'Africa')
})

test('Shows countries', async () => {
  let regions = getRegions()
  equal(regions.RU, 'Russia')
  equal(regions.IS, 'Iceland')
})

test('Order countries in alphabet asc', async () => {
  let regions = Object.values(getRegions())
  ok(regions.indexOf('Egypt') < regions.indexOf('Haiti'))
})

test('`Global` is first in countries list', async () => {
  let regions = Object.values(getRegions())
  equal(regions.indexOf('Global'), 0)
})

test.run()
