exports.adicionarFundos = (valor, usuario, billing, cartao) => {
    costumer = {
        "external_id": usuario._id,
        "name": usuario.nome,
        "type": "individual",
        "country": "br",
        "email": usuario.email,
        "documents": [
            {
            "type": "cpf",
            "number": usuario.cpf
            }
        ],
        "phone_numbers": ["+55"+usuario.celular],
        "birthday": usuario.nascimento
    };

    billing = {
        "name": usuario.nome,
        "address": {
            "country": "br",
            "state": usuario.uf,
            "city": usuario.cidade,
            "neighborhood": usuario.bairro,
            "street": usuario.rua,
            "street_number": usuario.numero,
            "zipcode": usuario.cep
        }
    };

    items = [
        {
            "id": valor,
            "title": valor+" reais de crédito",
            "unit_price": valor*100,
            "quantity": 1,
            "tangible": false
        }
    ];

    if(cartao){
        data = {
            "payment_method": "credit_card",
            "amount": valor*100,
            "card_number": cartao.numero,
            "card_cvv": cartao.cvv,
            "card_expiration_date": cartao.expiracao,
            "card_holder_name": cartao.nome,
            "costumer": costumer,
            "billing": billing,
            "items": items
        };
    }else{
        data = {
            "payment_method": "boleto",
            "amount": valor*100,
            "costumer": costumer,
            "billing": billing,
            "items": items
        };
    }

    console.log(data);
};