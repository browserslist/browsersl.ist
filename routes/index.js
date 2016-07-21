const express = require('express');
const router = express.Router();
const browserslist = require('browserslist');
const caniuse = require('caniuse-db/data.json').agents;
const url = require('url')

/* GET home page. */
router.get('/', function(req, res, next) {
  var query = req.query.q || "> 5%"
  try {
    var bl = browserslist(query);
  } catch (e) { }

  var compatible = {}

  if (bl) {
    bl.map( b => {
      b = b.split(" ")
      var db = caniuse[b[0]]

      if(!compatible[db.type]) {
        compatible[db.type] = []
      }

      compatible[db.type].push({
        "version": b[1],
        "id": b[0],
        "name": db.browser
      })
    })
  }

  res.render('index', { compatible: compatible, query: query });
});

module.exports = router;
