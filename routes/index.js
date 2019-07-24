var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'BrazilianBet API' });
});

router.get('/webhook', function(res, res, nex){
  var shell = require('shelljs');
  var result = shell.exec('GIT_WORK_TREE=/home/ubuntu/node/ApiBrazilianBet git pull').code;
  res.json({result: result==1?'success':'failed'});
});

module.exports = router;
