/*Modelo*/
const TravaPeriodo = require('../../models/lancamentos/travaPeriodo');

exports.buscarTravaPeriodo = (req, res, next) => {

  try {

    TravaPeriodo.findOne({
      _criador: req.userData.usuarioId
    }).then(registroEncontrado => {
      if (!registroEncontrado) {
        return res.status('200').json({
          mensagem: 'Nenhuma data encontrada',
          status: 'OK'
        });
      }

      res.status('200').json({
        mensagem: '',
        status: 'OK',
        travaPeriodo: registroEncontrado
      });

    }).catch(err => {
      res.status(500).json({
        mensagem: err,
        status: 'ER'
      });
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao buscar período',
      status: 'ER',
      retorno: err
    });
  }

}


exports.atualizarTravaPeriodo = (req, res, next) => {

  try {

    const travaPeriodo = new TravaPeriodo({
      ...req.body,
      _criador: req.userData.usuarioId
    });

    TravaPeriodo.findOneAndUpdate({
      _criador: req.userData.usuarioId
    }, {
      data: travaPeriodo.data
    }, (err, retorno) => {
      if (err) {
        console.log(err)
        return res.status('500').json({
          mensagem: 'Erro ao atualizar período',
          status: 'ER',
          retorno: err
        });
      }

      if (!retorno) {
        travaPeriodo.save().then(resultado => {
          return res.status(201).json({
            mensagem: 'Período atualizado com sucesso',
            status: 'OK',
            retorno: resultado
          })
        }).catch(err => {
          console.log(err);
          return res.status('500').json({
            mensagem: 'Erro ao atualizar período',
            status: 'ER',
            retorno: err
          });
        });
      } else {
        return res.status('200').json({
          mensagem: 'Período atualizado com sucesso',
          status: 'OK',
          travaPeriodo: retorno
        });
      }
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao atualizar período',
      status: 'ER',
      retorno: err
    })

  }

}