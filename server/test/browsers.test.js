import test from 'node:test'
import { equal, notEqual, ok, match } from 'node:assert'

import getBrowsers from '../lib/get-browsers.js'

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

test('Сoverage of all browsers should differ in different regions', async () => {
  let continentData = await getBrowsers('>1%', 'Global')
  let continentData = await getBrowsers(query, 'alt-as')

  notEqual(continentData.coverage, countryData.coverage)
})

test('Сoverage for browser should differ in different regions', async () => {
  let continentData = await getBrowsers('last 2 Chrome versions', 'alt-eu')
  let countryData = await getBrowsers('last 2 Chrome versions', 'NP')

  let continentBrowser = continentData.browsers[0]
  let countryBrowser = countryData.browsers[0]

  notEqual(continentBrowser.coverage, countryBrowser.coverage)
})
