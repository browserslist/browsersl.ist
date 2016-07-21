"use strict"

const express = require('express')
const router = express.Router()
const browserslist = require('browserslist')
const caniuse = require('caniuse-db/data.json').agents

/* GET home page. */
router.get('/', function(req, res) {
  const query = req.query.q || "> 5%"
  let bl = null
  try {
    bl = browserslist(query)
  } catch (e) {
    // Error
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
        "logo": "/images/" + b[0] + ".png"
      })
    })
  }

  res.render('index', { compatible: compatible, query: query })
})

module.exports = router
