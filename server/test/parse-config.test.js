import { equal } from 'node:assert'
import test from 'node:test'

import { jsonConfigToQuery } from '../lib/parse-config.js'

test('Should correctly extract query from JSON fragment input', () => {
  let input = `
    "browserslist": [
      "IE > 9",
      "chrome > 80"
    ]
  `

  equal(jsonConfigToQuery(input), 'IE > 9,chrome > 80')
})

test('Should correctly extract query from package.json-like input', () => {
  let input = `
  {
    "private": true,
    "browserslist": [
      "IE > 9",
      "chrome > 80"
    ]
  }
  `

  equal(jsonConfigToQuery(input), 'IE > 9,chrome > 80')
})
