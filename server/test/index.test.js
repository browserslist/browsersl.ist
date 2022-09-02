import { equal, match } from 'node:assert'
import { URL } from 'node:url'
import test from 'node:test'

import App from '../index.js'

const base = `http://localhost:${App.address().port}/`

test('Integration tests', async t => {
  await t.test('uses `defaults` query without `q` param', async () => {
    let url = new URL(`api/browsers`, base)
    let response = await fetch(url)
    let data = await response.json()
    equal(data.query, 'defaults')
  })

  await t.test('uses `Global` region without `region` param', async () => {
    let url = new URL(`api/browsers`, base)
    let response = await fetch(url)
    let data = await response.json()
    equal(data.region, 'alt-ww')
  })

  await t.test('responses status 200 for `/browsers` route', async () => {
    let url = new URL(`api/browsers`, base)
    let response = await fetch(url)
    equal(response.status, 200)
  })

  await t.test('responses 400 for wrong `q` param', async () => {
    let url = new URL(`api/browsers?q=wrong-query`, base)
    let response = await fetch(url)
    let error = await response.json()
    equal(response.status, 400)
    match(error.message, /Unknown/)
  })

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

  await t.test('loads static `/favicon.ico` with correct type', async () => {
    let url = new URL('/favicon.ico', base)
    let response = await fetch(url)
    equal(response.status, 200)
    equal(response.headers.get('Content-Type'), 'image/x-icon')
  })

  await t.test('loads static `/favicon.ico` with 1 hour cache', async () => {
    let url = new URL('/favicon.ico', base)
    let response = await fetch(url)
    equal(response.status, 200)
    equal(response.headers.get('Cache-Control'), 'max-age=3600')
  })

  await t.test('redirects from old search query to hash', async () => {
    let url = new URL(`/?q=defaults,%20ie%2011&utm=1`, base)
    let response = await fetch(url, { redirect: 'manual' })
    equal(response.status, 301)
    equal(
      response.headers.get('Location'),
      'http://localhost:3000/?utm=1#q=defaults%2C%20ie%2011'
    )
  })

  App.closeAllConnections()
  App.close()
})
