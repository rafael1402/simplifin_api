const mongoose = require('mongoose');

/*Modelo*/
const Despesa = require('../../models/lancamentos/despesa');
const Receita = require('../../models/lancamentos/receita');
const Categoria = require('../../models/cadastro/categoria');
const FormaPagamento = require('../../models/cadastro/forma-pagamento');
const Conta = require('../../models/cadastro/conta');
const {
  arrayify
} = require('tslint/lib/utils');
const despesa = require('../../models/lancamentos/despesa');

const mes = []
mes[0] = "Janeiro";
mes[1] = "Fevereiro";
mes[2] = "Março";
mes[3] = "Abril";
mes[4] = "Maio";
mes[5] = "Junho";
mes[6] = "Julho";
mes[7] = "Agosto";
mes[8] = "Setembro";
mes[9] = "Outubro";
mes[10] = "Novembro";
mes[11] = "Dezembro";


exports.despesasPorCategoria = (req, res, next) => {

  try {

    const dataInicio = new Date(req.query.dataInicio);
    const dataFim = new Date(req.query.dataFim);
    dataFim.setDate(dataFim.getDate() + 1);

    const despesas = Despesa.aggregate([{
      $match: {
        $and: [{
          data: {
            $gte: dataInicio,
            $lt: dataFim
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

      if (!despesas) {
        return res.status(200).json({
          mensagem: 'Relatório gerado com sucesso',
          status: 'OK',
          retorno: {
            data: [],
            label: [],
            color: []
          }
        });
      }

      Categoria.populate(despesas, {
        path: '_id'
      }, (err, retorno) => {
        if (err) {
          console.log(err)
          return res.status('500').json({
            mensagem: 'Erro eo executar o relatório',
            status: 'ER',
            retorno: err
          });
        }

        var data = [],
          label = [],
          color = {
            backgroundColor: []
          }

        retorno.forEach(element => {
          label.push(element._id.descricao)
          data.push(element.totalDespesa)
          color.backgroundColor.push(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        });

        res.status(200).json({
          mensagem: 'Relatório gerado com sucesso',
          status: 'OK',
          retorno: {
            label: label,
            data: data,
            color: color
          }
        });

      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      mensagem: 'Erro eo executar o relatório',
      status: 'ER',
      retorno: err
    })

  }

}

exports.despesasPorFormaPagamento = (req, res, next) => {

  try {

    const dataInicio = new Date(req.query.dataInicio);
    const dataFim = new Date(req.query.dataFim);
    dataFim.setDate(dataFim.getDate() + 1);

    const despesas = Despesa.aggregate([{
      $match: {
        $and: [{
          data: {
            $gte: dataInicio,
            $lt: dataFim
          }
        }, {
          _criador: mongoose.Types.ObjectId(req.userData.usuarioId)
        }]
      }
    }, {
      $group: {
        _id: "$formaPagamento",
        totalDespesa: {
          $sum: "$valor"
        }
      }
    }]).then((despesas) => {

      if (!despesas) {
        return res.status(200).json({
          mensagem: 'Relatório gerado com sucesso',
          status: 'OK',
          retorno: {
            data: [],
            label: [],
            color: []
          }
        });
      }

      FormaPagamento.populate(despesas, {
        path: '_id'
      }, (err, retorno) => {
        if (err) {
          console.log(err)
          return res.status('500').json({
            mensagem: 'Erro eo executar o relatório',
            status: 'ER',
            retorno: err
          });
        }

        var data = [],
          label = [],
          color = {
            backgroundColor: []
          }

        retorno.forEach(element => {
          label.push(element._id.descricao)
          data.push(element.totalDespesa)
          color.backgroundColor.push(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        });

        res.status(200).json({
          mensagem: 'Relatório gerado com sucesso',
          status: 'OK',
          retorno: {
            label: label,
            data: data,
            color: color
          }
        });

      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      mensagem: 'Erro eo executar o relatório',
      status: 'ER',
      retorno: err
    })

  }

}

exports.receitasPorCategoria = (req, res, next) => {

  try {

    const dataInicio = new Date(req.query.dataInicio);
    const dataFim = new Date(req.query.dataFim);
    dataFim.setDate(dataFim.getDate() + 1);

    const receitas = Receita.aggregate([{
      $match: {
        $and: [{
          data: {
            $gte: dataInicio,
            $lt: dataFim
          }
        }, {
          _criador: mongoose.Types.ObjectId(req.userData.usuarioId)
        }]
      }
    }, {
      $group: {
        _id: "$categoria",
        totalreceita: {
          $sum: "$valor"
        }
      }
    }]).then((receitas) => {

      if (!receitas) {
        return res.status(200).json({
          mensagem: 'Relatório gerado com sucesso',
          status: 'OK',
          retorno: {
            data: [],
            label: [],
            color: []
          }
        });
      }

      Categoria.populate(receitas, {
        path: '_id'
      }, (err, retorno) => {
        if (err) {
          console.log(err)
          return res.status('500').json({
            mensagem: 'Erro eo executar o relatório',
            status: 'ER',
            retorno: err
          });
        }

        var data = [],
          label = [],
          color = {
            backgroundColor: []
          }

        retorno.forEach(element => {
          label.push(element._id.descricao)
          data.push(element.totalreceita)
          color.backgroundColor.push(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        });

        res.status(200).json({
          mensagem: 'Relatório gerado com sucesso',
          status: 'OK',
          retorno: {
            label: label,
            data: data,
            color: color
          }
        });

      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      mensagem: 'Erro eo executar o relatório',
      status: 'ER',
      retorno: err
    })

  }

}

exports.balancoContas = (req, res, next) => {

  try {

    const dataInicio = new Date(req.query.dataInicio);
    const dataFim = new Date(req.query.dataFim);
    dataFim.setDate(dataFim.getDate() + 1);

    const contas = Conta.aggregate([{
      $match: {
        _criador: mongoose.Types.ObjectId(req.userData.usuarioId)
      }
    }, {
      $lookup: {
        from: "despesas",
        let: {
          id: "$_id" //localField
        },
        pipeline: [{
          $match: {
            $expr: {
              $and: [{
                  $eq: [
                    "$$id",
                    "$conta"
                  ]
                },
                {
                  $gte: ['$data', dataInicio]
                },
                {
                  $lt: ['$data', dataFim]
                },
              ]
            }
          }
        }, {
          $project: {
            _id: 0,
            conta: 1,
            valor: 1
          }
        }, {
          $group: {
            _id: "$conta",
            total: {
              $sum: "$valor"
            }
          }
        }],
        as: "despesas"
      }
    }, {
      $lookup: {
        from: "receitas",
        let: {
          id: "$_id" //localField
        },
        pipeline: [{
          $match: {
            $expr: {
              $and: [{
                  $eq: [
                    "$$id",
                    "$conta"
                  ]
                },
                {
                  $gte: ['$data', dataInicio]
                },
                {
                  $lt: ['$data', dataFim]
                },
              ]
            }
          }
        }, {
          $project: {
            _id: 0,
            conta: 1,
            valor: 1
          }
        }, {
          $group: {
            _id: "$conta",
            total: {
              $sum: "$valor"
            }
          }
        }],
        as: "receitas"
      }
    }, {
      $lookup: {
        from: "transferencias",
        let: {
          id: "$_id" //localField
        },
        pipeline: [{
          $match: {
            $expr: {
              $and: [{
                  $eq: [
                    "$$id",
                    "$contaOrigem"
                  ]
                },
                {
                  $gte: ['$data', dataInicio]
                },
                {
                  $lt: ['$data', dataFim]
                },
              ]
            }
          }
        }, {
          $project: {
            _id: 0,
            contaOrigem: 1,
            valor: 1
          }
        }, {
          $group: {
            _id: "$contaOrigem",
            total: {
              $sum: "$valor"
            }
          }
        }],
        as: "transferencias_saidas"
      }
    }, {
      $lookup: {
        from: "transferencias",
        let: {
          id: "$_id" //localField
        },
        pipeline: [{
          $match: {
            $expr: {
              $and: [{
                  $eq: [
                    "$$id",
                    "$contaDestino"
                  ]
                },
                {
                  $gte: ['$data', dataInicio]
                },
                {
                  $lt: ['$data', dataFim]
                },
              ]
            }
          }
        }, {
          $project: {
            _id: 0,
            contaDestino: 1,
            valor: 1
          }
        }, {
          $group: {
            _id: "$conta",
            total: {
              $sum: "$valor"
            }
          }
        }],
        as: "transferencias_entradas"
      }
    }]).then((retorno) => {

      if (!retorno) {
        return res.status(200).json({
          mensagem: 'Relatório gerado com sucesso',
          status: 'OK',
          retorno: []
        });
      }

      let resumoContas = [];

      retorno.forEach(conta => {

        let receitas = conta.receitas.length > 0 ? conta.receitas[0].total : 0
        despesas = conta.despesas.length > 0 ? conta.despesas[0].total : 0
        transferenciasEntradas = conta.transferencias_entradas.length > 0 ? conta.transferencias_entradas[0].total : 0
        transferenciasSaidas = conta.transferencias_saidas.length > 0 ? conta.transferencias_saidas[0].total : 0

        resumoContas.push({
          conta: conta.descricao,
          totalReceitas: receitas,
          totalDespesas: despesas,
          totalTransferenciasEntradas: transferenciasEntradas,
          totalTransferenciasSaidas: transferenciasSaidas,
          saldo: receitas - despesas + transferenciasEntradas - transferenciasSaidas
        })

      });

      return res.status(200).json({
        mensagem: 'Relatório gerado com sucesso',
        status: 'OK',
        retorno: resumoContas
      });

    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      mensagem: 'Erro eo executar o relatório',
      status: 'ER',
      retorno: err
    })

  }

}

exports.topDespesas = (req, res, next) => {


  try {
    const dataInicio = new Date(req.query.dataInicio);
    const dataFim = new Date(req.query.dataFim);
    dataFim.setDate(dataFim.getDate() + 1);

    const despesaQuery = Despesa.find({
      _criador: req.userData.usuarioId,
    }).populate('categoria').populate('centro');

    /*Para fazer a paginação*/
    if (dataInicio && dataFim) {
      despesaQuery.find({
        data: {
          $gte: dataInicio,
          $lt: dataFim
        }
      }).limit(5).sort({
        valor: -1
      });
    }
    despesaQuery.then(despesas => {

      if (!despesas) {
        return res.status(200).json({
          mensagem: 'Relatório gerado com sucesso',
          status: 'OK',
          retorno: [],
        });
      }

      var data = [],
        label = [],
        color = {
          backgroundColor: []
        };

      despesas.forEach(despesa => {
        label.push(despesa.descricao.length > 0 ? despesa.descricao : despesa.categoria.descricao);
        data.push(despesa.valor);
        color.backgroundColor.push(`#${Math.floor(Math.random()*16777215).toString(16)}`);
      });

      return res.status(200).json({
        mensagem: 'Relatório gerado com sucesso',
        status: 'OK',
        retorno: {
          label: label,
          data: data,
          color: color
        },
      });
    }).catch(error => {
      res.status('500').json({
        mensagem: "Erro eo executar o relatório",
        status: 'ER',
        retorno: error
      })
    });


  } catch (err) {
    console.log(err);
    return res.status(500).json({
      mensagem: 'Erro eo executar o relatório',
      status: 'ER',
      retorno: err
    })

  }
}

exports.topReceitas = (req, res, next) => {

  try {
    const dataInicio = new Date(req.query.dataInicio);
    const dataFim = new Date(req.query.dataFim);
    dataFim.setDate(dataFim.getDate() + 1);

    const receitaQuery = Receita.find({
      _criador: req.userData.usuarioId,
    }).populate('categoria').populate('centro');

    /*Para fazer a paginação*/
    if (dataInicio && dataFim) {
      receitaQuery.find({
        data: {
          $gte: dataInicio,
          $lt: dataFim
        }
      }).limit(5).sort({
        valor: -1
      });
    }
    receitaQuery.then(receitas => {

      if (!receitas) {
        return res.status(200).json({
          mensagem: 'Relatório gerado com sucesso',
          status: 'OK',
          retorno: [],
        });
      }

      var data = [],
        label = [],
        color = {
          backgroundColor: []
        };

      receitas.forEach(receita => {
        label.push(receita.descricao.length > 0 ? receita.descricao : receita.categoria.descricao);
        data.push(receita.valor);
        color.backgroundColor.push(`#${Math.floor(Math.random()*16777215).toString(16)}`);
      });

      return res.status(200).json({
        mensagem: 'Relatório gerado com sucesso',
        status: 'OK',
        retorno: {
          label: label,
          data: data,
          color: color
        },
      });
    }).catch(error => {
      res.status('500').json({
        mensagem: "Erro eo executar o relatório",
        status: 'ER',
        retorno: error
      })
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      mensagem: 'Erro eo executar o relatório',
      status: 'ER',
      retorno: err
    })

  }
}

exports.balancoMensal = (req, res, next) => {

  try {

    const dataInicio = new Date(req.query.dataInicio);
    const dataFim = new Date(req.query.dataFim);
    dataFim.setDate(dataFim.getDate() + 1);

    const despesas = Despesa.aggregate([{
      $match: {
        $and: [{
          data: {
            $gte: dataInicio,
            $lt: dataFim
          }
        }, {
          _criador: mongoose.Types.ObjectId(req.userData.usuarioId)
        }]
      }
    }, {
      $group: {
        _id: {
          mes: {
            $month: "$data"
          },
          ano: {
            $year: "$data"
          },
        },
        totalDespesa: {
          $sum: "$valor"
        }
      }
    }]).then((despesas) => {

      const receitas = Receita.aggregate([{
        $match: {
          $and: [{
            data: {
              $gte: dataInicio,
              $lt: dataFim
            }
          }, {
            _criador: mongoose.Types.ObjectId(req.userData.usuarioId)
          }]
        }
      }, {
        $group: {
          _id: {
            mes: {
              $month: "$data"
            },
            ano: {
              $year: "$data"
            },
          },
          totalReceita: {
            $sum: "$valor"
          }
        }
      }]).then((receitas) => {


        if (receitas.length == 0 && despesas.length == 0) {
          return res.status(200).json({
            mensagem: 'Relatório gerado com sucesso',
            status: 'OK',
            retorno: {
              data: [],
              label: [],
              color: []
            }
          });
        }

        var
          label = [],
          dataDespesa = [],
          dataReceita = [],
          color = {
            backgroundColor: []
          },
          anoInicio = +req.query.dataInicio.substring(0, 4),
          mesInicio = +req.query.dataInicio.substring(5, 7);

        anoFim = +req.query.dataFim.substring(0, 4)
        mesFim = +req.query.dataFim.substring(5, 7)

        /*Arrumar o filtro quando muda o ano*/
        while ((mesInicio <= mesFim && anoInicio <= anoFim) || (anoInicio < anoFim && mesInicio > mesFim)) {

          label.push(`${mes[mesInicio-1]}-${anoInicio}`)

          let despesa = despesas.find(despesa => {
            return despesa._id.mes == (mesInicio) && despesa._id.ano == anoInicio
          });

          dataDespesa.push(despesa ? despesa.totalDespesa : 0)

          let receita = receitas.find(receita => {
            return receita._id.mes == (mesInicio) && receita._id.ano == anoInicio
          });

          dataReceita.push(receita ? receita.totalReceita : 0)

          if (mesInicio == 12) {
            mesInicio = 1
            anoInicio = anoInicio + 1
          } else {
            mesInicio = mesInicio + 1
          }

        };

        return res.status(200).json({
          mensagem: 'Relatório gerado com sucesso',
          status: 'OK',
          retorno: {
            data: [{
              data: dataDespesa,
              label: 'Despesas'
            }, {
              data: dataReceita,
              label: 'Receitas'
            }],
            label: label,
            color: color
          }
        });


      });

    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      mensagem: 'Erro eo executar o relatório',
      status: 'ER',
      retorno: err
    })

  }

}
