import { ok } from 'node:assert'
import test from 'node:test'
import { URL } from 'node:url'

import app from '../index.js'

const PARALLEL_REQUESTS_NUMBER = 100

let base = `http://localhost:${app.address().port}/`

async function getFetchExecTime(url) {
  let timeStart = performance.now()
  await fetch(url)
  let timeEnd = performance.now()
  return timeEnd - timeStart
}

async function getAverageExecTime(url) {
  let requests = Array(PARALLEL_REQUESTS_NUMBER).fill(getFetchExecTime(url))
  let totalExecTime = (await Promise.all(requests)).reduce((a, b) => a + b, 0)
  return totalExecTime / PARALLEL_REQUESTS_NUMBER
}

test('Cache tests. 100 parallel HTTP-requests are faster than the 1st', async t => {
  await t.test('favicon `/favicon.ico`', async () => {
    let url = new URL('/favicon.ico', base)
    let firstExecTime = await getFetchExecTime(url)
    let averageExecTime = await getAverageExecTime(url)
    ok(averageExecTime < firstExecTime)
  })

  await t.test('main page `/`', async () => {
    let url = new URL('', base)
    let firstExecTime = await getFetchExecTime(url)
    let averageExecTime = await getAverageExecTime(url)
    ok(averageExecTime < firstExecTime)
  })

  app.closeAllConnections()
  app.close()
})
