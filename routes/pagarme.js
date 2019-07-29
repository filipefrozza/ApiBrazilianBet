var express = require('express');
var router = express.Router();
const pagarme = require('pagarme');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({});
});

router.post('/notificacao', function(req, res, next){
    console.log(req.body);
});

router.get('/teste', function(req, res, next){
    pagarme.client.connect({ api_key: 'ak_test_vyhjh3rc3PbxslGWfg17PgRcdQAzOR' })
    .then(client => {
        client.transactions.create(
            {
            "payment_method": "credit_card",
            "amount": 2000,
            "card_number": "4111111111111111",
            "card_cvv": "123",
            "card_expiration_date": "0922",
            "card_holder_name": "Morpheus Fishburne",
            "customer": {
                "external_id": "#3311",
                "name": "Morpheus Fishburne",
                "type": "individual",
                "country": "br",
                "email": "mopheus@nabucodonozor.com",
                "documents": [
                    {
                    "type": "cpf",
                    "number": "30621143049"
                    }
                ],
                "phone_numbers": ["+5511999998888", "+5511888889999"],
                "birthday": "1965-01-01"
            },
            "billing": {
                "name": "Morpheus Fishburne",
                "address": {
                    "country": "br",
                    "state": "SP",
                    "city": "Cotia",
                    "neighborhood": "Rio Cotia",
                    "street": "Rua Matrix",
                    "street_number": "9999",
                    "zipcode": "06714360"
                }
            },
            // "shipping": {},
            "items": [
                {
                    "id": "20",
                    "title": "20 reais de crédito",
                    "unit_price": 2000,
                    "quantity": 1,
                    "tangible": false
                }
            ]
        }
        // {"amount":30000,"payment_method":"credit_card","customer":{"external_id":"1737","name":"Filipe Frozza","type":"individual","country":"br","email":"filipefrozza.fm@gmail.com","phone_numbers":["+5551981088935"],"documents":[{"type":"cpf","number":"03599581096"}]},"items":[{"id":"3179","title":"RESOLU\u00c7\u00c3O DE QUEST\u00d5ES AJAJ TRF4\u00ba Analista Judici\u00e1rio - \u00c1rea Judici\u00e1ria Quest\u00f5es Online","unit_price":30000,"quantity":1,"tangible":false}],"installments":3,"postback_url":"https:\/\/www.aprovadores.com.br\/pagarme\/notificacao","card_holder_name":"Filipe Frozza","card_cvv":"111","card_number":"4444444444444444","card_expiration_date":"1222","billing":{"name":"Filipe Frozza","address":{"country":"br","street":"Rua Gramado","street_number":"176","state":"RS","city":"Canoas","neighborhood":"Mathias Velho","zipcode":"92330320"}}}
        ).then(data => {
            console.log(data);
            res.json(data);
        }).catch(e => {
            if(e.response){
                console.log(e.response.errors);
            }else{
                console.log(e);
            }
            res.json({});
        });
    })
    .then(transactions => console.log(transactions))
    .catch(error => console.log(error))
});

module.exports = router;
