import { test } from 'uvu'
import { equal, instance, match } from 'uvu/assert'

import getBrowsers from '../lib/get-browsers.js'

test('supports `alt-*` continent codes in `region`', async () => {
  let data = await getBrowsers('>0%', 'alt-af')
  equal(data.region, 'Africa')
})

test('supports alias `Global` continent code for `alt-ww` in `region`', async () => {
  let data = await getBrowsers('>0%', 'Global')
  equal(data.region, 'Global')
})

test('throws error for wrong browserslist `query`', async () => {
  let error
  try {
    await getBrowsers('wrong', 'alt-ww')
  } catch (e) {
    error = e
  }
  instance(error, Error)
  match(error.message, /Unknown browser query/)
})

test('throws error for wrong Can I Use `region`', async () => {
  let error
  try {
    await getBrowsers('>0%', 'XX')
  } catch (e) {
    error = e
  }
  instance(error, Error)
  match(error.message, /Unknown region name/)
})

test('returns Node.js versions without coverage`', async () => {
  let data = await getBrowsers('Node > 0', 'Global')

  equal(data.browsers[0].id, 'node')
})

test.run()
