var express = require('express');
var router = express.Router();
var browserslist = require('browserslist');

/* GET home page. */
router.get('/', function(req, res, next) {
  var browsers = browserslist(req.query.q);
  res.render('index', { title: 'Express' });
});

module.exports = router;
