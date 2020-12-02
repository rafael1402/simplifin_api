/*Modelo*/
const FormaPagamento = require('../../models/cadastro/forma-pagamento');
const Despesa = require('../../models/lancamentos/despesa');

exports.criarFormaPagamento = (req, res, next) => {

  try {

    const formaPagamento = new FormaPagamento({
      descricao: req.body.descricao,
      status: req.body.status,
      _criador: req.userData.usuarioId

    });

    formaPagamento.save().then(resultado => {
      res.status(201).json({
        mensagem: 'Forma de pagamento criada com sucesso',
        status: 'OK',
        retorno: resultado
      })
    }).catch(err => {
      console.log(err);
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao criar forma de pagamento',
      status: 'ER',
      retorno: err
    })

  }
}

exports.buscarFormaPagamento = (req, res, next) => {

  FormaPagamento.findOne({
    _criador: req.userData.usuarioId,
    _id: req.params.id
  }).then(registroEncontrado => {
    if (!registroEncontrado) {
      return res.status('404').json({
        mensagem: 'Forma de pagamento não encontrada',
        status: 'ER',
      });
    }

    res.status('200').json({
      mensagem: '',
      status: 'OK',
      formaPagamento: {
        descricao: registroEncontrado.descricao,
        status: registroEncontrado.status,
        id: registroEncontrado._id
      }
    })

  }).catch(err => {
    res.status(500).json({
      mensagem: err,
      status: 'ER'
    })
  });

}

exports.listarFormasPagamento = (req, res, next) => {
  /*Coloca o + na atribuição da variavel converte em numerico*/
  const pageSize = +req.query.pagesize;
  const currentePage = +req.query.page;
  const status = +req.query.status;
  const formaPagamentoQuery = FormaPagamento.find({
    _criador: req.userData.usuarioId
  });
  let formasPagamento;

  if (status) {
    formaPagamentoQuery.find({
      status: status
    })
  }

  /*Para fazer a paginação*/
  if (currentePage && pageSize) {
    formaPagamentoQuery
      .skip(pageSize * (currentePage - 1))
      .limit(pageSize);
  }
  formaPagamentoQuery.then(documents => {
    formasPagamento = documents;
    return FormaPagamento.countDocuments();
  }).then(count => {
    res.status(200).json({
      mensagem: 'Formas de pagamento carregadas com sucesso',
      status: 'OK',
      formasPagamento: formasPagamento,
      maxItens: count
    });
  }).catch(error => {
    res.status('500').json({
      mensagem: "Erro ao listar forma de pagamentos",
      status: 'ER'
    })
  });
}

exports.atualizarFormaPagamento = (req, res, next) => {

  FormaPagamento.findOneAndUpdate({
    _criador: req.userData.usuarioId,
    _id: req.params.id
  }, {
    descricao: req.body.descricao,
    status: req.body.status
  }, {
    upsert: true
  }, (err, retorno) => {
    if (err) {
      console.log(err)
      return res.status('500').json({
        mensagem: err,
        status: 'ER',
      });

    } else {
      return res.status('200').json({
        mensagem: 'Forma de pagamento atualizada com sucesso',
        status: 'OK',
        formaPagamento: {
          descricao: retorno.descricao,
          status: retorno.status,
          id: retorno._id
        }
      });
    }
  })

}

exports.deletarFormaPagamento = (req, res, next) => {

  try {

    Despesa.findOne({
      formaPagamento: req.params.id
    }).then(reg => {
      if (reg) {
        return res.status('403').json({
          mensagem: 'Não é possivel excluir centro pois ele está sendo usado em um lançamento',
          status: 'ER',
        });
      }

      FormaPagamento.findOneAndDelete({
        _criador: req.userData.usuarioId,
        _id: req.params.id
      }, (err, retorno) => {
        if (err) {
          return res.status('500').json({
            mensagem: err,
            status: 'ER',
          });

        } else {
          return res.status('200').json({
            mensagem: 'Forma de pagamento exlcuída com sucesso',
            status: 'OK',
          });
        }
      });
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao excluir forma de pagamento',
      status: 'ER',
      retorno: err
    })

  }

}
