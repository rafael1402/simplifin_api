const mongoose = require('mongoose');

/*Modelo*/
const Meta = require('../../models/metas/meta');
const MetaItem = require('../../models/metas/metaItem');
const Despesa = require('../../models/lancamentos/despesa');

exports.criarMeta = (req, res, next) => {

  try {

    const meta = new Meta({
      descricao: req.body.descricao,
      dataInicio: new Date(req.body.dataInicio),
      dataFim: new Date(req.body.dataFim),
      _criador: req.userData.usuarioId
    });

    var metaItens = [];

    meta.save().then(resultado => {

      req.body.metaItens.forEach(item => {

        let metaItem = new MetaItem({
          meta: resultado._id,
          ...item,
          _criador: req.userData.usuarioId

        });
        metaItens.push(metaItem);
      });

      MetaItem.insertMany(metaItens, (err, docs) => {
        if (err) {
          return res.status(500).json({
            mensagem: 'Erro ao criar os itens meta',
            status: 'ER',
            retorno: err
          })

        } else {

          return res.status(201).json({
            mensagem: 'Meta criada com sucesso',
            status: 'OK',
            retorno: resultado
          })
        }
      })

    }).catch(err => {
      console.log(err);
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      mensagem: 'Erro ao criar meta',
      status: 'ER',
      retorno: err
    })

  }
}

exports.buscarMeta = (req, res, next) => {

  try {

    const metaQuery = MetaItem.find({
      meta: req.params.id,
      _criador: req.userData.usuarioId,
    }).populate('meta');

    let metas;

    metaQuery.then(documents => {
      metas = documents;
      return Meta.countDocuments();
    }).then(count => {
      res.status(200).json({
        mensagem: 'Meta carregada com sucesso',
        status: 'OK',
        metaItens: metas,
        meta: metas[0].meta,
        maxItens: count
      });
    }).catch(error => {
      res.status('500').json({
        mensagem: "Erro ao buscar metas",
        status: 'ER'
      })
    });




  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao buscar meta',
      status: 'ER',
      retorno: err
    })

  }

}

exports.listarMetas = (req, res, next) => {

  try {

    const metaQuery = Meta.find({
      _criador: req.userData.usuarioId,
    });

    let metas;

    metaQuery.then(documents => {
      metas = documents;
      return Meta.countDocuments();
    }).then(count => {
      res.status(200).json({
        mensagem: 'Lista de metas carregada com sucesso',
        status: 'OK',
        metas: metas,
        maxItens: count
      });
    }).catch(error => {
      res.status('500').json({
        mensagem: "Erro ao listar metas",
        status: 'ER'
      })
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao listar metas',
      status: 'ER',
      retorno: err
    })

  }

}

exports.atualizarMeta = (req, res, next) => {

  try {

    Meta.findOneAndUpdate({
      _criador: req.userData.usuarioId,
      _id: req.params.id
    }, {
      descricao: req.body.descricao,
      dataInicio: req.body.dataInicio,
      dataFim: req.body.dataFim,
      _criador: req.userData.usuarioId
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

        let metaItens = [];

        req.body.metaItens.forEach(item => {

          let metaItem = new MetaItem({
            meta: req.params.id,
            ...item,
            _criador: req.userData.usuarioId

          });
          metaItens.push(metaItem);
        });

        MetaItem.deleteMany({
          meta: req.params.id,
          _criador: req.userData.usuarioId
        }, (err, docs) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              mensagem: 'Erro ao atualizar os itens meta',
              status: 'ER',
              retorno: err
            })

          } else {

            MetaItem.insertMany(metaItens, (err, docs) => {
              if (err) {
                console.log(err);
                return res.status(500).json({
                  mensagem: 'Erro ao atualizar os itens meta',
                  status: 'ER',
                  retorno: err
                })

              } else {

                return res.status(201).json({
                  mensagem: 'Meta atualizada com sucesso',
                  status: 'OK',
                  retorno: docs
                })
              }
            })
          }
        })
      }
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao atualizar metas',
      status: 'ER',
      retorno: err
    })

  }

}

exports.deletarMeta = (req, res, next) => {

  try {


    Meta.findOneAndDelete({
      _criador: req.userData.usuarioId,
      _id: req.params.id
    }, (err, retorno) => {
      if (err) {
        return res.status('500').json({
          mensagem: err,
          status: 'ER',
        });

      } else {

        MetaItem.deleteMany({
          meta: req.params.id,
          _criador: req.userData.usuarioId
        }, (err, docs) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              mensagem: 'Erro ao atualizar os itens meta',
              status: 'ER',
              retorno: err
            })

          } else {
            return res.status('200').json({
              mensagem: 'Meta exlcuída com sucesso',
              status: 'OK',
            });
          }
        });
      }
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao deletar metas',
      status: 'ER',
      retorno: err
    })

  }

}

exports.validaMeta = (req, res, next) => {

  try {

    /*Verifica se tem categorias */
    if (req.body.metaItens.length == 0) {
      return res.status(500).json({
        mensagem: 'É necessário cadastraro ao menos uma categoria',
        status: 'ER',
        retorno: ''
      });
    }

    /*Verifica itens duplicados*/
    var categorias = req.body.metaItens.map(function (item) {
      return item.categoria
    });
    var duplicado = categorias.some(function (item, idx) {
      return categorias.indexOf(item) != idx
    });

    if (duplicado) {
      return res.status(500).json({
        mensagem: 'É não é possivel cadastrar meta com categorias repetidas',
        status: 'ER',
        retorno: ''
      });
    }
    /*Verifica as datas */
    var dataInicio = new Date(req.body.dataInicio);
    var dataFim = new Date(req.body.dataFim);
    dataFim.setDate(dataFim.getDate() + 1);

    Meta.find({
      _criador: req.userData.usuarioId,
      dataInicio: {
        $gte: dataInicio,
        $lt: dataFim
      },
      _id: {
        $ne: req.params.id
      }
    }).then(documents => {

      if (documents.length > 0) {

        return res.status(500).json({
          mensagem: 'Já existe uma meta cadastrada nesse mesmo período',
          status: 'ER',
          retorno: ''
        });

      }

      Meta.find({
        _criador: req.userData.usuarioId,
        dataInicio: {
          $gte: dataInicio,
          $lt: dataFim
        },
        _id: {
          $ne: req.params.id
        }
      }).then(documents => {

        if (documents.length > 0) {

          return res.status(500).json({
            mensagem: 'já existe uma meta cadastrada nesse mesmo período',
            status: 'ER',
            retorno: ''
          });

        }

        next()
      }).catch(error => {
        res.status('500').json({
          mensagem: "Erro ao validar metas",
          status: 'ER'
        })
      });

    }).catch(error => {
      res.status('500').json({
        mensagem: "Erro ao validar metas",
        status: 'ER'
      })
    });


  } catch (err) {
    console.log(err);
    res.status(500).json({
      mensagem: 'Erro ao validar metas',
      status: 'ER',
      retorno: err
    })

  }

}

exports.acompanharMeta = (req, res, next) => {

  try {

    const metaQuery = MetaItem.find({
      meta: req.params.id,
      _criador: req.userData.usuarioId,
    }).populate('meta').populate('categoria').then(metas => {

      var dataInicio = new Date(metas[0].meta.dataInicio);
      var dataFim = new Date(metas[0].meta.dataFim);
      dataFim.setDate(dataFim.getDate() + 1);

      const categoriasMeta = metas.map((element) => {
        return element.categoria._id
      })

      const despesas = Despesa.aggregate([{
        $match: {
          $and: [{
            data: {
              $gte: dataInicio,
              $lt: dataFim
            }
          }, {
            categoria: {
              $in: categoriasMeta
            }
          }, {
            _criador: mongoose.Types.ObjectId(req.userData.usuarioId)
          }]
        }
      }, {
        $group: {
          _id: "$categoria",
          totalDespesa: {
            $sum: "$valor"
          }
        }
      }]).then((despesas) => {



        let Itens = []

        metas.forEach(meta => {
          let categoriaId = meta.categoria._id
          let despesa = despesas.find(despesa => despesa._id == categoriaId.toString())
          let percentualMeta = 0
          let totalDespesa = 0

          if(despesa){
            percentualMeta = Math.round(((despesa.totalDespesa * 100 / meta.valor) + Number.EPSILON) * 100) / 100;
            totalDespesa = despesa.totalDespesa;
          }

          Itens.push({
            categoria: meta.categoria,
            valor: meta.valor,
            totalDespesa: totalDespesa,
            percentualMeta: percentualMeta
          })
        });

        res.status(200).json({
          mensagem: 'Meta carregada com sucesso',
          status: 'OK',
          metaAcompanhamento: Itens,
          meta: metas[0].meta
        });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      mensagem: 'Erro ao buscar meta',
      status: 'ER',
      retorno: err
    })

  }

}
