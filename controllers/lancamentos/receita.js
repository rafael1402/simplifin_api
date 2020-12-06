/*Modelo*/
const Receita = require('../../models/lancamentos/receita');
const TravaPeriodo = require('../../models/lancamentos/travaPeriodo');

exports.criarReceita = (req, res, next) => {

  try {

    var receita = new Receita();
    var receitas = [];
    const rep = req.body.repeticao > 0 ? req.body.repeticao : 1;

    for (let index = 0; index < rep; index++) {
      receita = {
        ...req.body,
        _criador: req.userData.usuarioId
      };

      if (receita.repeticaoTipo == 'P') {
        receita.valor = Math.round(((receita.valor / receita.repeticao) + Number.EPSILON) * 100) / 100;
        receita.descricao = `(${index + 1}/${receita.repeticao}) ${receita.descricao}`;
      }


      if (index > 0) {
        let data = new Date(receita.data);
        data = data.setMonth(data.getMonth() + index);
        receita.data = data;
      }
      receitas.push(receita);
    }

    Receita.insertMany(receitas, (err, docs) => {
      if (err) {
        return res.status(500).json({
          mensagem: 'Erro ao criar receita',
          status: 'ER',
          retorno: err
        })

      } else {
        return res.status(201).json({
          mensagem: 'Receita criada com sucesso',
          status: 'OK',
          retorno: docs
        })
      }
    })

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao criar receita',
      status: 'ER',
      retorno: err
    })

  }
}

exports.buscarReceita = (req, res, next) => {

  Receita.findOne({
    _criador: req.userData.usuarioId,
    _id: req.params.id
  }).then(registroEncontrado => {
    if (!registroEncontrado) {
      return res.status('404').json({
        mensagem: 'Receita não encontrada',
        status: 'ER',
      });
    }

    res.status('200').json({
      mensagem: '',
      status: 'OK',
      receita: registroEncontrado
    })

  }).catch(err => {
    res.status(500).json({
      mensagem: err,
      status: 'ER'
    })
  });

}

exports.listarReceitas = (req, res, next) => {
  /*Coloca o + na atribuição da variavel converte em numerico*/
  const dataInicio = new Date(req.query.dataInicio);
  const dataFim = new Date(req.query.dataFim);
  dataFim.setDate(dataFim.getDate() + 1);

  const receitaQuery = Receita.find({
    _criador: req.userData.usuarioId,
  }).populate('tag').populate('categoria').populate('conta');

  let receitas;

  /*Para fazer a paginação*/
  if (dataInicio && dataFim) {
    receitaQuery.find({
      data: {
        $gte: dataInicio,
        $lt: dataFim
      }
    });
  }

  receitaQuery.then(documents => {
    receitas = documents;
    return Receita.countDocuments();
  }).then(count => {
    res.status(200).json({
      mensagem: 'Lista de receitas carregada com sucesso',
      status: 'OK',
      receitas: receitas,
      maxItens: count
    });
  }).catch(error => {
    res.status('500').json({
      mensagem: "Erro ao listar receitas",
      status: 'ER'
    })
  });
}

exports.atualizarReceita = (req, res, next) => {

  const receita = new Receita({
    ...req.body,
    _criador: req.userData.usuarioId
  });

  Receita.findOneAndUpdate({
    _criador: req.userData.usuarioId,
    _id: req.params.id
  }, receita, {
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
        mensagem: 'Receita atualizada com sucesso',
        status: 'OK',
        receita: retorno
      });
    }
  })

}

exports.deletarReceita = (req, res, next) => {

  Receita.findOneAndDelete({
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
        mensagem: 'Receita exlcuída com sucesso',
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
            mensagem: "Lançamento não permitido. Data inferior a data de encerramento do período",
            status: 'ER'
          });
        }

        if (req.params.id) {

          Receita.findOne({
            _criador: req.userData.usuarioId,
            _id: req.params.id
          }).then(receitaEncontrada => {
            if (!receitaEncontrada) {
              next();
            }

            let data = new Date(receitaEncontrada.data);
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
