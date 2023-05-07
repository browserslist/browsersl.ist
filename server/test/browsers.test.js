import { equal, notEqual, ok, match } from 'node:assert'
import test from 'node:test'

import { getBrowsers } from '../lib/get-browsers.js'

test('Throws error for wrong browserslist `query`', async () => {
  let error
  try {
    await getBrowsers('wrong', 'alt-ww')
  } catch (e) {
    error = e
  }
  ok(error instanceof Error)
  match(error.message, /Unknown browser query/)
})

test('Returns multiple browser names and versions by `>1%` query', async () => {
  let data = await getBrowsers('>1%', 'alt-ww')
  let browsersNames = data.browsers
  let browsersVersions = Object.keys(browsersNames[0])

  ok(browsersNames.length > 0)
  ok(browsersVersions.length > 0)
})

test('Throws error for wrong Can I Use `region`', async () => {
  let error
  try {
    await getBrowsers('>0%', 'XX')
  } catch (e) {
    error = e
  }
  ok(error instanceof Error)
  match(error.message, /Unknown region name/)
})

test('Returns Node.js versions without coverage`', async () => {
  let data = await getBrowsers('Node > 0', 'alt-ww')

  equal(data.browsers[0].name, 'Node')
  equal(data.browsers[0].coverage, null)
})

test('Coverage of all browsers should differ in regions', async () => {
  let continentData = await getBrowsers('>1%', 'alt-ww')
  let countryData = await getBrowsers('>1%', 'IT')

  notEqual(continentData.coverage, countryData.coverage)
})
