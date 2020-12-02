/*Modelo*/
const Tag = require('../../models/cadastro/tag');

exports.criarTag = (req, res, next) => {

  try {

    const tag = new Tag({
      descricao: req.body.descricao,
      cor: req.body.cor,
      corTexto: req.body.corTexto,
      status: req.body.status,
      _criador: req.userData.usuarioId

    });

    tag.save().then(resultado => {
      res.status(201).json({
        mensagem: 'Tag criada com sucesso',
        status: 'OK',
        retorno: resultado
      })
    }).catch(err => {
      console.log(err);
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao criar tag',
      status: 'ER',
      retorno: err
    })

  }
}

exports.buscarTag = (req, res, next) => {

  Tag.findOne({
    _criador: req.userData.usuarioId,
    _id: req.params.id
  }).then(registroEncontrado => {
    if (!registroEncontrado) {
      return res.status('404').json({
        mensagem: 'Tag não encontrada',
        status: 'ER',
      });
    }

    res.status('200').json({
      mensagem: '',
      status: 'OK',
      tag: {
        descricao: registroEncontrado.descricao,
        cor: registroEncontrado.cor,
        corTexto: registroEncontrado.corTexto,
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

exports.listarTags = (req, res, next) => {
  /*Coloca o + na atribuição da variavel converte em numerico*/
  const pageSize = +req.query.pagesize;
  const currentePage = +req.query.page;
  const status = +req.query.status;
  const tagQuery = Tag.find({
    _criador: req.userData.usuarioId
  });
  let tags;

  if (status) {
    tagQuery.find({
      status: status
    })
  }

  /*Para fazer a paginação*/
  if (currentePage && pageSize) {
    tagQuery
      .skip(pageSize * (currentePage - 1))
      .limit(pageSize);
  }
  tagQuery.then(documents => {
    tags = documents;
    return Tag.countDocuments();
  }).then(count => {
    res.status(200).json({
      mensagem: 'Lista de tags carregada com sucesso',
      status: 'OK',
      tags: tags,
      maxItens: count
    });
  }).catch(error => {
    res.status('500').json({
      mensagem: "Erro ao listar tags",
      status: 'ER'
    })
  });
}

exports.atualizarTag = (req, res, next) => {

  Tag.findOneAndUpdate({
    _criador: req.userData.usuarioId,
    _id: req.params.id
  }, {
    descricao: req.body.descricao,
    status: req.body.status,
    cor: req.body.cor,
    corTexto: req.body.corTexto,
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
        mensagem: 'Tag atualizada com sucesso',
        status: 'OK',
        tag: {
          descricao: retorno.descricao,
          status: retorno.status,
          cor: retorno.cor,
          status: retorno.status,
          id: retorno._id
        }
      });
    }
  })

}

exports.deletarTag = (req, res, next) => {

  Tag.findOneAndDelete({
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
        mensagem: 'Tag exlcuída com sucesso',
        status: 'OK',
      });
    }
  })

}
