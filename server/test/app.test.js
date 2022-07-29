import { match } from 'assert'
import { URL } from 'url'
import { test } from 'uvu'
import { equal } from 'uvu/assert'

import App from '../app.js'

const base = `http://localhost:${App.address().port}/api/`

test('responses `defauts` query for `/browsers` route without `q` param', async () => {
  let url = new URL(`browsers`, base)
  let response = await fetch(url)
  let data = await response.json()
  equal(data.query, 'defaults')
})

test('responses `Global` region for `/browsers` route without `region` param', async () => {
  let url = new URL(`browsers`, base)
  let response = await fetch(url)
  let data = await response.json()
  equal(data.region, 'Global')
})

test('responses status 200 for `/browsers` route', async () => {
  let url = new URL(`browsers`, base)
  let response = await fetch(url)
  equal(response.status, 200)
})

test('responses 404 for unknown route', async () => {
  let url = new URL(`wrong-route`, base)
  let response = await fetch(url)
  let error = await response.json()

  equal(response.status, 404)
  match(error.message, /Not found/)
})

test.after(() => {
  App.closeAllConnections()
  App.close()
})

test.run()
