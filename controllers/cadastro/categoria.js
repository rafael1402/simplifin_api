/*Modelo*/
const Categoria = require('../../models/cadastro/categoria');
const Despesa = require('../../models/lancamentos/despesa');
const Receita = require('../../models/lancamentos/receita');
const MetaItem = require('../../models/metas/metaItem');


exports.criarCategoria = (req, res, next) => {

  try {

    const categoria = new Categoria({
      tipo: req.body.tipo,
      descricao: req.body.descricao,
      status: req.body.status,
      _criador: req.userData.usuarioId

    });

    categoria.save().then(resultado => {
      res.status(201).json({
        mensagem: 'Categoria criada com sucesso',
        status: 'OK',
        retorno: resultado
      })
    }).catch(err => {
      console.log(err);
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao criar categoria',
      status: 'ER',
      retorno: err
    })

  }
}

exports.buscarCategoria = (req, res, next) => {

  Categoria.findOne({
    _criador: req.userData.usuarioId,
    _id: req.params.id
  }).then(registroEncontrado => {
    if (!registroEncontrado) {
      return res.status('404').json({
        mensagem: 'Categoria não encontrada',
        status: 'ER',
      });
    }

    res.status('200').json({
      mensagem: '',
      status: 'OK',
      categoria: {
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

}

exports.listarCategorias = (req, res, next) => {

  try {

    /*Coloca o + na atribuição da variavel converte em numerico*/
    const pageSize = +req.query.pagesize;
    const currentePage = +req.query.page;
    const tipo = req.query.tipo;
    const status = +req.query.status;

    const categoriaQuery = Categoria.find({
      _criador: req.userData.usuarioId,
    });

    let categorias;

    if (tipo && status) {
      categoriaQuery.find({
        tipo: tipo,
        status: status
      })
    }
    /*Para fazer a paginação*/
    if (currentePage && pageSize) {
      categoriaQuery
        .skip(pageSize * (currentePage - 1))
        .limit(pageSize);
    }

    categoriaQuery.then(documents => {
      categorias = documents;
      return Categoria.countDocuments();
    }).then(count => {
      res.status(200).json({
        mensagem: 'Lista de categorias carregada com sucesso',
        status: 'OK',
        categorias: categorias,
        maxItens: count
      });
    }).catch(error => {
      res.status('500').json({
        mensagem: "Erro ao listar categorias",
        status: 'ER'
      })
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao listar categorias',
      status: 'ER',
      retorno: err
    })

  }

}

exports.atualizarCategoria = (req, res, next) => {

  try {

    Categoria.findOneAndUpdate({
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
          mensagem: 'Categoria atualizada com sucesso',
          status: 'OK',
          categoria: {
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
      mensagem: 'Erro ao atualizar categoria',
      status: 'ER',
      retorno: err
    })

  }

}

exports.deletarCategoria = (req, res, next) => {

  try {

    Despesa.findOne({
      categoria: req.params.id
    }).then(reg => {
      if (reg) {
        return res.status('403').json({
          mensagem: 'Não é possivel excluir categoria pois ela está sendo usada em um lançamento',
          status: 'ER',
        });
      }

      Receita.findOne({
        categoria: req.params.id
      }).then(reg => {
        if (reg) {
          return res.status('403').json({
            mensagem: 'Não é possivel excluir categoria pois ela está sendo usada em um lançamento',
            status: 'ER',
          });
        }

        MetaItem.findOne({
          categoria: req.params.id
        }).then(reg => {
          if (reg) {
            return res.status('403').json({
              mensagem: 'Não é possivel excluir categoria pois ela está sendo usada em uma meta',
              status: 'ER',
            });
          }

          Categoria.findOneAndDelete({
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
                mensagem: 'Categoria exlcuída com sucesso',
                status: 'OK',
              });
            }
          });
        });
      });
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao excluir categoria',
      status: 'ER',
      retorno: err
    });

  }

}
