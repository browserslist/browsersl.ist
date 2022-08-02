import test from 'node:test'
import { equal, notEqual, ok, match } from 'node:assert'

import getBrowsers from '../lib/get-browsers.js'

test('Throws error for wrong browserslist `query`', async () => {
  let error
  try {
    await getBrowsers('wrong', 'Global')
  } catch (e) {
    error = e
  }
  ok(error instanceof Error)
  match(error.message, /Unknown browser query/)
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
  let data = await getBrowsers('Node > 0', 'Global')

  equal(data.browsers[0].name, 'Node')
  equal(data.browsers[0].coverage, null)
})

test('Сoverage of all browsers should differ in different regions', async () => {
  let continentData = await getBrowsers('>1%', 'Global')
  let countryData = await getBrowsers('>1%', 'IT')

  notEqual(continentData.coverage, countryData.coverage)
})

test('Сoverage for browser should differ in different regions', async () => {
  let continentData = await getBrowsers('last 2 Chrome versions', 'alt-eu')
  let countryData = await getBrowsers('last 2 Chrome versions', 'NP')

  let continentBrowser = continentData.browsers[0]
  let countryBrowser = countryData.browsers[0]

  notEqual(continentBrowser.coverage, countryBrowser.coverage)
})
