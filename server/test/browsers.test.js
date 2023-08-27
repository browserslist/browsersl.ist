import { equal, match, notEqual, ok } from 'node:assert'
import test from 'node:test'

import { getBrowsers } from '../lib/get-browsers.js'

function approximatelyEqual(actual, expected) {
  let tolerance = 2
  let diff = Math.abs(actual - expected)
  ok(diff <= tolerance)
}

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

test('The sum of the coverage versions equals the total coverage in global', async () => {
  let data = await getBrowsers('cover 80%')
  let sumOfCoverages = data.browsers.reduce((sum, x) => sum + x.coverage, 0)
  let totalCoverage = data.coverage

  approximatelyEqual(sumOfCoverages, totalCoverage)
})

test('The sum of the coverage versions equals the total coverage in region', async () => {
  let data = await getBrowsers('cover 45% in BR', 'BR')
  let sumOfCoverages = data.browsers.reduce((sum, x) => sum + x.coverage, 0)
  let totalCoverage = data.coverage

  approximatelyEqual(sumOfCoverages, totalCoverage)
})
