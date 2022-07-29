import { test } from 'uvu'
import { equal, instance, match } from 'uvu/assert'

import getBrowsers from '../lib/get-browsers.js'

test('Throws error for wrong browserslist `query`', async () => {
  let error
  try {
    await getBrowsers('wrong', 'Global')
  } catch (e) {
    error = e
  }
  instance(error, Error)
  match(error.message, /Unknown browser query/)
})

test('Throws error for wrong Can I Use `region`', async () => {
  let error
  try {
    await getBrowsers('>0%', 'XX')
  } catch (e) {
    error = e
  }
  instance(error, Error)
  match(error.message, /Unknown region name/)
})

test('Returns Node.js versions without coverage`', async () => {
  let data = await getBrowsers('Node > 0', 'Global')

  equal(data.browsers[0].id, 'node')
})

test.run()
