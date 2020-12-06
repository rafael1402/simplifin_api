/*Modelo*/
const Despesa = require('../../models/lancamentos/despesa');
const TravaPeriodo = require('../../models/lancamentos/travaPeriodo');

exports.criarDespesa = (req, res, next) => {

  try {

    var despesa = new Despesa();
    var despesas = [];
    const rep = req.body.repeticao > 0 ? req.body.repeticao : 1;

    for (let index = 0; index < rep; index++) {
      despesa = {
        ...req.body,
        _criador: req.userData.usuarioId
      };

      if (despesa.repeticaoTipo == 'P') {
        despesa.valor = Math.round(((despesa.valor / despesa.repeticao) + Number.EPSILON) * 100) / 100;
        despesa.descricao = `(${index + 1}/${despesa.repeticao}) ${despesa.descricao}`;
      }

      if (despesa.percentualRateio > 0)
        despesa.valorRateio = Math.round((despesa.valor * (despesa.percentualRateio / 100) + Number.EPSILON) * 100) / 100;

      if (index > 0) {
        let data = new Date(despesa.data);
        data = data.setMonth(data.getMonth() + index);
        despesa.data = data;
      }
      despesas.push(despesa);
    }

    Despesa.insertMany(despesas, (err, docs) => {
      if (err) {
        return res.status(500).json({
          mensagem: 'Erro ao criar despesa',
          status: 'ER',
          retorno: err
        })

      } else {
        return res.status(201).json({
          mensagem: 'Despesa criada com sucesso',
          status: 'OK',
          retorno: docs
        })
      }
    })

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao criar despesa',
      status: 'ER',
      retorno: err
    })

  }
}

exports.buscarDespesa = (req, res, next) => {

  Despesa.findOne({
    _criador: req.userData.usuarioId,
    _id: req.params.id
  }).then(registroEncontrado => {
    if (!registroEncontrado) {
      return res.status('404').json({
        mensagem: 'Despesa não encontrada',
        status: 'ER',
      });
    }

    res.status('200').json({
      mensagem: '',
      status: 'OK',
      despesa: registroEncontrado
    })

  }).catch(err => {
    res.status(500).json({
      mensagem: err,
      status: 'ER'
    })
  });

}

exports.listarDespesas = (req, res, next) => {
  /*Coloca o + na atribuição da variavel converte em numerico*/
  const dataInicio = new Date(req.query.dataInicio);
  const dataFim = new Date(req.query.dataFim);
  dataFim.setDate(dataFim.getDate() + 1);

  const despesaQuery = Despesa.find({
    _criador: req.userData.usuarioId,
  }).populate('formaPagamento').populate('conta').populate('tag').populate('categoria').populate('centro');

  let despesas;

  /*Para fazer a paginação*/
  if (dataInicio && dataFim) {
    despesaQuery.find({
      data: {
        $gte: dataInicio,
        $lt: dataFim
      }
    });
  }

  despesaQuery.then(documents => {
    despesas = documents;
    return Despesa.countDocuments();
  }).then(count => {
    res.status(200).json({
      mensagem: 'Lista de despesas carregada com sucesso',
      status: 'OK',
      despesas: despesas,
      maxItens: count
    });
  }).catch(error => {
    res.status('500').json({
      mensagem: "Erro ao listar despesas",
      status: 'ER'
    })
  });
}

exports.atualizarDespesa = (req, res, next) => {

  const despesa = new Despesa({
    ...req.body,
    _criador: req.userData.usuarioId
  });

  if (despesa.percentualRateio > 0)
    despesa.valorRateio = Math.round((despesa.valor * (despesa.percentualRateio / 100) + Number.EPSILON) * 100) / 100;

  Despesa.findOneAndUpdate({
    _criador: req.userData.usuarioId,
    _id: req.params.id
  }, despesa, {
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
        mensagem: 'Despesa atualizada com sucesso',
        status: 'OK',
        despesa: retorno
      });
    }
  })

}

exports.deletarDespesa = (req, res, next) => {

  Despesa.findOneAndDelete({
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
        mensagem: 'Despesa exlcuída com sucesso',
        status: 'OK',
      });
    }
  })

}

exports.verificaPeriodo = (req, res, next) => {
  try {

    TravaPeriodo.findOne({
      _criador: req.userData.usuarioId
    }).then(registroEncontrado => {
      if (!registroEncontrado) {
        next();
      } else {

        let data = new Date(req.body.data);
        let diferenca = data.getTime() - registroEncontrado.data.getTime();
        if (diferenca <= 0) {
          return res.status(403).json({
            mensagem: "Lançamento não permitido. Data inferior à data de encerramento do período",
            status: 'ER'
          });
        }

        if (req.params.id) {
          Despesa.findOne({
            _criador: req.userData.usuarioId,
            _id: req.params.id
          }).then(despesaEncontrada => {
            if (!despesaEncontrada) {
              next();
            }

            let data = new Date(despesaEncontrada.data);
            let diferenca = data.getTime() - registroEncontrado.data.getTime();
            if (diferenca <= 0) {
              return res.status(403).json({
                mensagem: "Lançamento não permitido. Data inferior à data de encerramento do período",
                status: 'ER'
              });
            }
            next();

          }).catch(err => {
            res.status(500).json({
              mensagem: err,
              status: 'ER'
            });
          });
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      mensagem: error,
      status: 'ER'
    });
  }
};