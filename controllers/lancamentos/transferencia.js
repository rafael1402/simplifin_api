/*Modelo*/
const Transferencia = require('../../models/lancamentos/transferencia');
const TravaPeriodo = require('../../models/lancamentos/travaPeriodo');


exports.criarTransferencia = (req, res, next) => {

  try {

    var transferencia = new Transferencia();
    var transferencias = [];
    const rep = req.body.repeticao > 0 ? req.body.repeticao : 1;

    for (let index = 0; index < rep; index++) {
      transferencia = {
        ...req.body,
        _criador: req.userData.usuarioId
      };

      if (transferencia.repeticaoTipo == 'P') {
        transferencia.valor = Math.round(((transferencia.valor / transferencia.repeticao) + Number.EPSILON) * 100) / 100;
        transferencia.descricao = `(${index + 1}/${transferencia.repeticao}) ${transferencia.descricao}`;
      }


      if (index > 0) {
        let data = new Date(transferencia.data);
        data = data.setMonth(data.getMonth() + index);
        transferencia.data = data;
      }
      transferencias.push(transferencia);
    }

    Transferencia.insertMany(transferencias, (err, docs) => {
      if (err) {
        return res.status(500).json({
          mensagem: 'Erro ao criar transferencia',
          status: 'ER',
          retorno: err
        })

      } else {
        return res.status(201).json({
          mensagem: 'Transferencia criada com sucesso',
          status: 'OK',
          retorno: docs
        })
      }
    })

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao criar transferencia',
      status: 'ER',
      retorno: err
    })

  }
}

exports.buscarTransferencia = (req, res, next) => {

  Transferencia.findOne({
    _criador: req.userData.usuarioId,
    _id: req.params.id
  }).then(registroEncontrado => {
    if (!registroEncontrado) {
      return res.status('404').json({
        mensagem: 'Transferencia não encontrada',
        status: 'ER',
      });
    }

    res.status('200').json({
      mensagem: '',
      status: 'OK',
      transferencia: registroEncontrado
    })

  }).catch(err => {
    res.status(500).json({
      mensagem: err,
      status: 'ER'
    })
  });

}

exports.listarTransferencias = (req, res, next) => {
  /*Coloca o + na atribuição da variavel converte em numerico*/
  const dataInicio = new Date(req.query.dataInicio);
  const dataFim = new Date(req.query.dataFim);
  dataFim.setDate(dataFim.getDate() + 1);

  const transferenciaQuery = Transferencia.find({
    _criador: req.userData.usuarioId,
  }).populate('tag').populate('contaDestino').populate('contaOrigem').populate('conta');

  let transferencias;

  /*Para fazer a paginação*/
  if (dataInicio && dataFim) {
    transferenciaQuery.find({
      data: {
        $gte: dataInicio,
        $lt: dataFim
      }
    });
  }

  transferenciaQuery.then(documents => {
    transferencias = documents;
    return Transferencia.countDocuments();
  }).then(count => {
    res.status(200).json({
      mensagem: 'Lista de transferencias carregada com sucesso',
      status: 'OK',
      transferencias: transferencias,
      maxItens: count
    });
  }).catch(error => {
    res.status('500').json({
      mensagem: "Erro ao listar transferencias",
      status: 'ER'
    })
  });
}

exports.atualizarTransferencia = (req, res, next) => {

  const transferencia = new Transferencia({
    ...req.body,
    _criador: req.userData.usuarioId
  });

  Transferencia.findOneAndUpdate({
    _criador: req.userData.usuarioId,
    _id: req.params.id
  }, transferencia, {
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
        mensagem: 'Transferencia atualizada com sucesso',
        status: 'OK',
        transferencia: retorno
      });
    }
  })

}

exports.deletarTransferencia = (req, res, next) => {

  Transferencia.findOneAndDelete({
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
        mensagem: 'Transferencia exlcuída com sucesso',
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

          Transferencia.findOne({
            _criador: req.userData.usuarioId,
            _id: req.params.id
          }).then(transferenciaEncontrada => {
            if (!transferenciaEncontrada) {
              next();
            }

            let data = new Date(transferenciaEncontrada.data);
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
