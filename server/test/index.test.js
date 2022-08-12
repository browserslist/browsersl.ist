import { equal, match } from 'node:assert'
import { URL } from 'node:url'
import test from 'node:test'

import App from '../index.js'

const base = `http://localhost:${App.address().port}/`

test('Integration tests', async t => {
  await t.test(
    'responses `defauts` query for `/browsers` route without `q` param',
    async () => {
      let url = new URL(`api/browsers`, base)
      let response = await fetch(url)
      let data = await response.json()
      equal(data.query, 'defaults')
    }
  )

  await t.test(
    'responses `Global` region for `/browsers` route without `region` param',
    async () => {
      let url = new URL(`api/browsers`, base)
      let response = await fetch(url)
      let data = await response.json()
      equal(data.region, 'Global')
    }
  )

  await t.test('responses status 200 for `/browsers` route', async () => {
    let url = new URL(`api/browsers`, base)
    let response = await fetch(url)
    equal(response.status, 200)
  })

  await t.test(
    'responses 400 for `/browsers` route with wrong `q` param',
    async () => {
      let url = new URL(`api/browsers?q=wrong-query`, base)
      let response = await fetch(url)
      let error = await response.json()
      equal(response.status, 400)
      match(error.message, /Unknown/)
    }
  )

  await t.test('responses 404 for unknown route', async () => {
    let url = new URL(`wrong-route`, base)
    let response = await fetch(url)
    let text = await response.text()
    equal(response.status, 404)
    match(text, /Not Found/)
  })

  await t.test('opens the file index.html by the URL `/`', async () => {
    let url = new URL('', base)
    let response = await fetch(url)
    let html = await response.text()
    equal(response.status, 200)
    match(html, /Browserslist/)
    match(html, /<body/)
  })

  await t.test(
    'loads static `/favicon.ico` with correct MIME-type',
    async () => {
      let url = new URL('/favicon.ico', base)
      let response = await fetch(url)
      equal(response.status, 200)
      equal(response.headers.get('Content-Type'), 'image/x-icon')
    }
  )

  await t.test('loads static `/favicon.ico` with 1 hour cache', async () => {
    let url = new URL('/favicon.ico', base)
    let response = await fetch(url)
    equal(response.status, 200)
    equal(response.headers.get('Cache-Control'), 'max-age=3600')
  })

  App.closeAllConnections()
  App.close()
})
