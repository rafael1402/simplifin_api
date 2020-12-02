/*Modelo*/
const Centro = require('../../models/cadastro/centro');
const Despesa = require('../../models/lancamentos/despesa');

exports.criarCentro = (req, res, next) => {

  try {

    const centro = new Centro({
      descricao: req.body.descricao,
      status: req.body.status,
      _criador: req.userData.usuarioId

    });

    centro.save().then(resultado => {
      res.status(201).json({
        mensagem: 'Centro criado com sucesso',
        status: 'OK',
        retorno: resultado
      })
    }).catch(err => {
      console.log(err);
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao criar centro',
      status: 'ER',
      retorno: err
    })

  }
}

exports.buscarCentro = (req, res, next) => {

  try {

    Centro.findOne({
      _criador: req.userData.usuarioId,
      _id: req.params.id
    }).then(registroEncontrado => {
      if (!registroEncontrado) {
        return res.status('404').json({
          mensagem: 'Centro não encontrado',
          status: 'ER',
        });
      }

      res.status('200').json({
        mensagem: '',
        status: 'OK',
        centro: {
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

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao buscar centro',
      status: 'ER',
      retorno: err
    })

  }

}

exports.listarCentros = (req, res, next) => {

  try {
    /*Coloca o + na atribuição da variavel converte em numerico*/
    const pageSize = +req.query.pagesize;
    const currentePage = +req.query.page;
    const status = +req.query.status;
    const centroQuery = Centro.find({
      _criador: req.userData.usuarioId
    });
    let centros;

    if (status) {
      centroQuery.find({
        status: status
      })
    }

    /*Para fazer a paginação*/
    if (currentePage && pageSize) {
      centroQuery
        .skip(pageSize * (currentePage - 1))
        .limit(pageSize);
    }
    centroQuery.then(documents => {
      centros = documents;
      return Centro.countDocuments();
    }).then(count => {
      res.status(200).json({
        mensagem: 'Centros carregados com sucesso',
        status: 'OK',
        centros: centros,
        maxItens: count
      });
    }).catch(error => {
      res.status('500').json({
        mensagem: "Erro ao listar centros",
        status: 'ER'
      })
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao listar centro',
      status: 'ER',
      retorno: err
    })

  }

}

exports.atualizarCentro = (req, res, next) => {

  try {

    Centro.findOneAndUpdate({
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
          mensagem: 'Centro atualizado com sucesso',
          status: 'OK',
          centro: {
            descricao: retorno.descricao,
            status: retorno.status,
            id: retorno._id
          }
        });
      }
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao atualizar centro',
      status: 'ER',
      retorno: err
    })

  }

}

exports.deletarCentro = (req, res, next) => {

  try {

    Despesa.findOne({
      centro: req.params.id
    }).then(reg => {
      if (reg) {
        return res.status('403').json({
          mensagem: 'Não é possivel excluir centro pois ele está sendo usado em um lançamento',
          status: 'ER',
        });
      }

      Centro.findOneAndDelete({
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
            mensagem: 'Centro exlcuído com sucesso',
            status: 'OK',
          });
        }
      })

    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao excluir centro',
      status: 'ER',
      retorno: err
    })

  }

}
