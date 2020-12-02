/*Modelo*/
const Conta = require('../../models/cadastro/conta');
const Despesa = require('../../models/lancamentos/despesa');
const Receita = require('../../models/lancamentos/receita');
const Transferencia = require('../../models/lancamentos/transferencia');


exports.criarConta = (req, res, next) => {

  try {

    const conta = new Conta({
      tipo: req.body.tipo,
      descricao: req.body.descricao,
      status: req.body.status,
      _criador: req.userData.usuarioId

    });

    conta.save().then(resultado => {
      res.status(201).json({
        mensagem: 'Conta criado com sucesso',
        status: 'OK',
        retorno: resultado
      })
    }).catch(err => {
      console.log(err);
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao criar conta',
      status: 'ER',
      retorno: err
    })

  }
}

exports.buscarConta = (req, res, next) => {

  try {

    Conta.findOne({
      _criador: req.userData.usuarioId,
      _id: req.params.id
    }).then(registroEncontrado => {
      if (!registroEncontrado) {
        return res.status('404').json({
          mensagem: 'Conta não encontrada',
          status: 'ER',
        });
      }

      res.status('200').json({
        mensagem: '',
        status: 'OK',
        conta: {
          descricao: registroEncontrado.descricao,
          tipo: registroEncontrado.tipo,
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

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao criar conta',
      status: 'ER',
      retorno: err
    })

  }

}

exports.listarContas = (req, res, next) => {

  try {
    /*Coloca o + na atribuição da variavel converte em numerico*/
    const pageSize = +req.query.pagesize;
    const currentePage = +req.query.page;
    const status = +req.query.status;
    const contaQuery = Conta.find({
      _criador: req.userData.usuarioId
    });
    let contas;

    if (status) {
      contaQuery.find({
        status: status
      })
    }

    /*Para fazer a paginação*/
    if (currentePage && pageSize) {
      contaQuery
        .skip(pageSize * (currentePage - 1))
        .limit(pageSize);
    }
    contaQuery.then(documents => {
      contas = documents;
      return Conta.countDocuments();
    }).then(count => {
      res.status(200).json({
        mensagem: 'Lista de contas carregada com sucesso',
        status: 'OK',
        contas: contas,
        maxItens: count
      });
    }).catch(error => {
      res.status('500').json({
        mensagem: "Erro ao listar contas",
        status: 'ER'
      })
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao listar conta',
      status: 'ER',
      retorno: err
    })

  }
}

exports.atualizarConta = (req, res, next) => {

  try {

    Conta.findOneAndUpdate({
      _criador: req.userData.usuarioId,
      _id: req.params.id
    }, {
      tipo: req.body.tipo,
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
          mensagem: 'Conta atualizada com sucesso',
          status: 'OK',
          conta: {
            descricao: retorno.descricao,
            tipo: retorno.tipo,
            status: retorno.status,
            id: retorno._id
          }
        });
      }
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao atualizar conta',
      status: 'ER',
      retorno: err
    })

  }

}

exports.deletarConta = (req, res, next) => {

  try {

    Despesa.findOne({
      conta: req.params.id
    }).then(reg => {
      if (reg) {
        return res.status('403').json({
          mensagem: 'Não é possivel excluir conta pois ela está sendo usada em um lançamento',
          status: 'ER',
        });
      }

      Receita.findOne({
        conta: req.params.id
      }).then(reg => {
        if (reg) {
          return res.status('403').json({
            mensagem: 'Não é possivel excluir conta pois ela está sendo usada em um lançamento',
            status: 'ER',
          });
        }

        Transferencia.findOne({
          contaOrigem: req.params.id
        }).then(reg => {
          if (reg) {
            return res.status('403').json({
              mensagem: 'Não é possivel excluir conta pois ela está sendo usada em uma transferência',
              status: 'ER',
            });
          }

          Transferencia.findOne({
            contaDestino: req.params.id
          }).then(reg => {
            if (reg) {
              return res.status('403').json({
                mensagem: 'Não é possivel excluir conta pois ela está sendo usada em uma transferência',
                status: 'ER',
              });
            }

            Conta.findOneAndDelete({
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
                  mensagem: 'Conta exlcuída com sucesso',
                  status: 'OK',
                });
              }
            });
          });
        });
      });
    });
  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao excluir conta',
      status: 'ER',
      retorno: err
    })

  }

}
