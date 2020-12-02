exports.validarDatas = (req, res, next) => {

  const dataInicio = new Date(req.query.dataInicio);
  const dataFim = new Date(req.query.dataFim);

  if (dataInicio && dataFim) {
    next();
  } else {
    return res.status(401).json({
      message: "Parametros data inicio e data fim são obrigatórios"
    });
  }
}
