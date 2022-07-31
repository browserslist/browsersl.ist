import test from 'node:test'
import { equal, match } from 'assert'
import { URL } from 'url'

import App from '../app.js'

const base = `http://localhost:${App.address().port}/api/`

test('Integration tests', async (t) => {
  await t.test('responses `defauts` query for `/browsers` route without `q` param', async () => {
    let url = new URL(`browsers`, base)
    let response = await fetch(url)
    let data = await response.json()
    equal(data.query, 'defaults')
  })

  await t.test('responses `Global` region for `/browsers` route without `region` param', async () => {
    let url = new URL(`browsers`, base)
    let response = await fetch(url)
    let data = await response.json()
    equal(data.region, 'Global')
  })

  await t.test('responses status 200 for `/browsers` route', async () => {
    let url = new URL(`browsers`, base)
    let response = await fetch(url)
    equal(response.status, 200)
  })

  await t.test('responses 400 for `/browsers` route with wrong `q` param', async () => {
    let url = new URL(`browsers?q=wrong-query`, base)
    let response = await fetch(url)
    let error = await response.json()

    equal(response.status, 400)
    match(error.message, /Unknown/)
  })

  await t.test('responses 404 for unknown route', async () => {
    let url = new URL(`wrong-route`, base)
    let response = await fetch(url)
    let error = await response.json()

    equal(response.status, 404)
    match(error.message, /Not found/)
  })

  App.closeAllConnections()
  App.close()
})
