var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'API BrazilianBet' });
});

router.get('/webhook', function(res, res, nex){
  var shell = require('shelljs');
  require('shelljs/global');
  global.verbose = true;
  var result = shell.exec('git pull');
  result += " | "+shell.pwd();
  res.json({result: result});
});

router.post('/webhook', function(res, res, nex){
  var shell = require('shelljs');
  require('shelljs/global');
  global.verbose = true;
  var result = shell.exec('git pull');
  result += " | "+shell.pwd();
  res.json({result: result});
});

module.exports = router;
