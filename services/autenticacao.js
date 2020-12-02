const jwt = require("jsonwebtoken");
const tokenParans = require('../config/token-parans')


exports.autenticar = (req, res, next) => {
  try {
    const token = req.headers.authorazation.split(" ")[1];
    const decodedToken = jwt.verify(token, tokenParans.key);

    req.userData = {
      email: decodedToken.email,
      usuarioId: decodedToken.usuarioId,
      premium: decodedToken.premium
    };
    next();
  } catch (error) {
    res.status(401).json({
      message: "Falha na autenticação do usuário"
    });
  }
};

exports.varificarPermissao = (req, res, next) => {
  try {
    const token = req.headers.authorazation.split(" ")[1];
    const decodedToken = jwt.verify(token, tokenParans.key);

    if (decodedToken.premium == 0) {
      return res.status(401).json({
        message: "Usuário sem permissão para acessar essa funcionalidade"
      });
    }
    next();
  } catch (error) {
    res.status(401).json({
      message: "Falha na autenticação do usuário"
    });
  }
};
