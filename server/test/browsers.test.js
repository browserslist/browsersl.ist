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
