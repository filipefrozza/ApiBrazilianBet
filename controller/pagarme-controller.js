exports.buildTransaction = (itens, usuario, cartao, res) => {
    if(!usuario){
        return res.status(400).json({ 'msg': 'Problemas na autenticação' });
    }

    if(!itens){
        return res.status(400).json({ 'msg': 'Você deve informar os itens' });
    }

    customer = {
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
        "phone_numbers": ["+55"+usuario.telefone.replace(/(\(|\)|\s|\-)/g,'')],
        "birthday": usuario.nascimento.toISOString().split('T')[0]
    };

    items = [];

    total = 0;

    for(i in itens){
        items.push(
            {
                "id": itens[i].id,
                "title": itens[i].descricao,
                "unit_price": itens[i].preco*100,
                "quantity": itens[i].quantidade,
                "tangible": itens[i].fisico
            }
        );
        total+=itens[i].preco;
    }

    if(cartao){
        billing = {
            "name": cartao.nome,
            "address": {
                "country": "br",
                "state": cartao.estado,
                "city": cartao.cidade,
                "neighborhood": cartao.bairro,
                "street": cartao.rua,
                "street_number": cartao.numero,
                "zipcode": cartao.cep.replace('-','')
            }
        };

        data = {
            "payment_method": "credit_card",
            "amount": total*100,
            "card_number": cartao.numero,
            "card_cvv": cartao.cvv,
            "card_expiration_date": cartao.expiracao,
            "card_holder_name": cartao.nome,
            "customer": customer,
            "billing": billing,
            "items": items
        };
    }else{
        billing = {
            "name": usuario.nome,
            "address": {
                "country": "br",
                "state": usuario.estado,
                "city": usuario.cidade,
                "neighborhood": usuario.bairro,
                "street": usuario.rua,
                "street_number": usuario.numero,
                "zipcode": usuario.cep.replace('-','')
            }
        };

        data = {
            "payment_method": "boleto",
            "amount": total*100,
            "customer": customer,
            "billing": billing,
            "items": items
        };
    }

    console.log(data);
    // res.json(data);
    exports.sendTransaction(data, res);
};

exports.sendTransaction = (transaction, res) => {
    pagarmeAPI.client.connect({ api_key: 'ak_test_vyhjh3rc3PbxslGWfg17PgRcdQAzOR' })
    .then(client => {
        client.transactions.create(transaction)
        .then(data => {
            console.log(data);
            res.json(data);
        })
        .catch(e => {
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
}