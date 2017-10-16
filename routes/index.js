"use strict"

const express = require('express')
const router = express.Router()
const browserslist = require('browserslist')
const caniuse = require('caniuse-db/data.json').agents
const GA_ID = process.env.GA_ID
const pkg = require('../package.json')
const countries = require('../countries.json')

/* GET home page. */
router.get('/', function(req, res) {
  const query = req.query.q || "defaults"
  const countryCode = req.query.c || "global"
  const country = (countryCode === "global")
    ? {code: "global", name: "Global"}
    : countries.find(e => e.code === countryCode)

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
      const db = caniuse[b[0]]

      if(!compatible[db.type]) {
        compatible[db.type] = []
      }

      compatible[db.type].push({
        "version": b[1],
        "id": b[0],
        "name": db.browser,
        "coverage": browserslist.coverage([b.join(' ')], country.code),
        "logo": "/images/" + b[0] + ".png"
      })
    })
  }

  res.render('index', {
    compatible: compatible,
    query: query,
    GA_ID: GA_ID,
    blversion: pkg.dependencies["browserslist"],
    coverage: browserslist.coverage(bl, country.code),
    countries,
    country,
    description: "A page to display compatible browsers from a browserslist string."
  })
})

module.exports = router
