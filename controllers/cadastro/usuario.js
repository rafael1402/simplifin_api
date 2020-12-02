const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenParans = require('../../config/token-parans')
const {
  OAuth2Client
} = require('google-auth-library');

/*Modelo*/
const Usuario = require('../../models/cadastro/usuario');

const client = new OAuth2Client(tokenParans.googleKey);

exports.criarUsuario = (req, res, next) => {

  try {

    bcrypt.hash(req.body.senha, 10).then(hash => {
      const usuario = new Usuario({
        nomeCompleto: req.body.nomeCompleto,
        email: req.body.email,
        senha: hash,
        premium: 0
      });
      usuario.save((err, retorno) => {
        if (err) {
          if (err.errors.email.kind == "unique") {
            return res.status('500').json({
              mensagem: `O e-mail informado já está cadastrado`,
              status: 'ER',
            });

          } else {
            return res.status('500').json({
              mensagem: err,
              status: 'ER',
            });
          }

        } else {
          return res.status('200').json({
            mensagem: 'Usuário cadastrado com sucesso',
            status: 'OK',
            retorno: retorno
          });
        }
      })
    });

  } catch (err) {

    res.status(500).json({
      mensagem: 'Erro ao criar usuário',
      status: 'ER',
      retorno: err
    });

  }

}

exports.buscarUsuario = (req, res, next) => {

  Usuario.findOne({
    _id: req.userData.usuarioId
  }).then(usuarioEncontrado => {
    if (!usuarioEncontrado) {
      return res.status('404').json({
        mensagem: 'Usuário não Encontrado',
        status: 'ER',
      });
    }
    res.status('200').json({
      nomeCompleto: usuarioEncontrado.nomeCompleto,
      email: usuarioEncontrado.email,
      premium: usuarioEncontrado.premium
    })

  }).catch(err => {
    res.status(500).json({
      mensagem: err,
      status: 'ER'
    })
  });

}

exports.atualizarUsuario = (req, res, next) => {



  Usuario.findByIdAndUpdate({
    _id: req.userData.usuarioId
  }, {
    nomeCompleto: req.body.nomeCompleto,
    email: req.body.email
  }, {
    upsert: true
  }, (err, retorno) => {
    if (err) {
      console.log(err)

      if (err.codeName === "DuplicateKey") {
        return res.status('500').json({
          mensagem: "O e-mail informado já está cadastrado",
          status: 'ER',
        });

      } else {
        return res.status('500').json({
          mensagem: err,
          status: 'ER',
        });
      }

    } else {
      return res.status('200').json({
        mensagem: 'Usuário atualizado com sucesso',
        status: 'OK',
      });
    }
  })

}

exports.ativarPremium = (req, res, next) => {

  Usuario.findByIdAndUpdate({
    _id: req.userData.usuarioId
  }, {
    premium: req.body.premium
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
        mensagem: 'Usuário atualizado com sucesso',
        status: 'OK',
      });
    }
  })

}

exports.atualizarSenha = (req, res, next) => {

  let consultaUsuario;

  Usuario.findOne({
    _id: req.userData.usuarioId
  }).then(usuarioEncontrado => {
    if (!usuarioEncontrado) {
      return false;
    }
    consultaUsuario = usuarioEncontrado;
    if (consultaUsuario.senha.length == 0) {
      //usuário cadastrado via social login
      return true
    }
    return bcrypt.compare(req.body.senhaAtual, consultaUsuario.senha);
  }).then(retorno => {
    if (!retorno) {
      return res.status('401').json({
        mensagem: 'A senha atual informada não está correta',
        status: 'ER',
      });
    }

    bcrypt.hash(req.body.novaSenha, 10).then(hash => {

      Usuario.findByIdAndUpdate({
        _id: consultaUsuario._id
      }, {
        senha: hash
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
            mensagem: 'Senha atualizada com sucesso',
            status: 'OK',
          });
        }
      })


    });



  }).catch(err => {
    res.status(500).json({
      mensagem: err,
      status: 'ER'
    })
  });

}

exports.login = (req, res, next) => {

  let consultaUsuario;

  Usuario.findOne({
    email: req.body.email
  }).then(usuarioEncontrado => {
    if (!usuarioEncontrado) {
      return false;
    }
    consultaUsuario = usuarioEncontrado;
    return bcrypt.compare(req.body.senha, consultaUsuario.senha);
  }).then(retorno => {
    if (!retorno) {
      return res.status('401').json({
        mensagem: 'Usuário ou senha inválidos',
        status: 'ER',
      });
    }

    const token = jwt.sign({
      email: consultaUsuario.email,
      usuarioId: consultaUsuario._id,
      premium: consultaUsuario.premium
    }, tokenParans.key, {
      expiresIn: tokenParans.expiraEmHoras
    });

    res.status('200').json({
      mensagem: 'Login realizado com sucesso',
      token: token,
      expiraEm: tokenParans.expiraEmSegundos,
      status: 'OK',
      usuarioId: consultaUsuario._id,
      nomeCompleto: consultaUsuario.nomeCompleto,
      premium: consultaUsuario.premium
    })


  }).catch(err => {
    res.status(500).json({
      mensagem: err,
      status: 'ER'
    })
  });

}


exports.socialLogin = (req, res, next) => {
  verify(req.body.idToken).then((ticket) => {

    if (!ticket.email_verified) {
      return res.status('500').json({
        mensagem: 'Falha na autenticação do usuário',
        status: 'ER',
      });
    }

    Usuario.findOne({
      email: req.body.email
    }).then(retorno => {
      if (!retorno) {
        let usuario = new Usuario({
          nomeCompleto: req.body.name,
          email: req.body.email,
          senha: '',
          premium: 0
        });

        usuario.save((err, retorno) => {
          console.log(err);
          if (err) {
            return res.status('500').json({
              mensagem: err,
              status: 'ER',
            });
          } else {
            let token = jwt.sign({
              email: retorno.email,
              usuarioId: retorno._id,
              premium: retorno.premium
            }, tokenParans.key, {
              expiresIn: tokenParans.expiraEmHoras
            });

            res.status('200').json({
              mensagem: 'Login realizado com sucesso',
              token: token,
              expiraEm: tokenParans.expiraEmSegundos,
              status: 'OK',
              usuarioId: retorno._id,
              nomeCompleto: retorno.nomeCompleto,
              premium: retorno.premium
            });
          }
        });
      } else {
        let token = jwt.sign({
          email: retorno.email,
          usuarioId: retorno._id,
          premium: retorno.premium
        }, tokenParans.key, {
          expiresIn: tokenParans.expiraEmHoras
        });

        res.status('200').json({
          mensagem: 'Login realizado com sucesso',
          token: token,
          expiraEm: tokenParans.expiraEmSegundos,
          status: 'OK',
          usuarioId: retorno._id,
          nomeCompleto: retorno.nomeCompleto,
          premium: retorno.premium
        });
      }
    }).catch(err => {
      res.status(500).json({
        mensagem: err,
        status: 'ER'
      })
    });
  }).catch(console.error);
}

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: tokenParans.googleKey
  });
  return ticket.payload;
}
