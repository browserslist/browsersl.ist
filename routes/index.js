"use strict"

const express = require('express')
const router = express.Router()
const browserslist = require('browserslist')
const bv = require('browserslist/package.json').version
const cv = require('caniuse-db/package.json').version
const caniuse = require('caniuse-db/data.json').agents
const GA_ID = process.env.GA_ID

let caniuseRegion

function getCoverage(data, version) {
  const lastVersion = Object.keys(data).sort(function(a, b) { return parseInt(b) - parseInt(a); })[0]
  // If specific version coverage is missing, fall back to "version zero"
  return data[version] !== undefined ? data[version] : data[lastVersion]
}

function getRegionCoverage(region, id, version) {
  if (!caniuseRegion) {
    caniuseRegion = require('caniuse-db/region-usage-json/' + region + '.json')
  }

  return getCoverage(caniuseRegion.data[id], version)
}

/* GET home page. */
router.get('/', function(req, res) {
  const query = req.query.q || "defaults"
  const queryHasIn = query.match(/ in ((?:alt-)?[A-Za-z]{2})(?:,|$)/)

  const region = queryHasIn ? queryHasIn[1] : undefined

  let bl = null
  try {
    bl = browserslist(query)
  } catch (e) {
    // Error
    return res.render('index', {
      compatible: null,
      query: query,
      GA_ID: GA_ID,
      description: "A page to display compatible browsers from a browserslist string.",
      error: e
    })
  }

  const compatible = {}

  if (bl) {
    bl.map((b) => {
      b = b.split(" ")

      const id = b[0]
      const version = b[1]

      let coverage, type, name

      // "Can I use" doesn't have stats for Node
      if (id === 'node') {
        type = 'server'
        name = 'Node'
      } else {
        const db = caniuse[id]

        coverage = region ? getRegionCoverage(region, id, version) : getCoverage(db.usage_global, version)
        type = db.type
        name = db.browser
      }

      if(!compatible[type]) {
        compatible[type] = []
      }

      compatible[type].push({
        version: version,
        id: id,
        name: name,
        coverage: coverage,
        logo: "/images/" + id + ".png"
      })
    })
  }

  res.render('index', {
    compatible: compatible,
    query: query,
    GA_ID: GA_ID,
    bv: bv,
    cv: cv,
    coverage: browserslist.coverage(bl, region),
    description: "A page to display compatible browsers from a browserslist string.",
    region: region || 'Global'
  })
})

module.exports = router
