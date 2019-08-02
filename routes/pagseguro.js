var express = require('express');
var router = express.Router();
var pagseguroController = require('../controller/pagseguro-controller.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({});
});

router.post('/notificacao', function(req, res, next){
    console.log(req.body);
});

router.get('/adicionar-fundos', function(req, res, next){
    pagseguroController.buildTransaction([
        {
            "id": req.body.valor,
            "descricao": req.body.valor+" reais de crédito",
            "preco": req.body.valor,
            "quantidade": 1,
            "peso": 0,
            "frete": 0
        }
    ],req.body.usuario,res);
});

module.exports = router;
