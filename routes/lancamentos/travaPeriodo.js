/*Ferramentas*/
const express = require("express");
const verificaAutenticacao = require('../../services/autenticacao')

/*Rota*/
const router = express.Router();

/*Controller*/
const travaPeriodoController = require('../../controllers/lancamentos/travaPeriodo')

router.get('/', verificaAutenticacao.autenticar, travaPeriodoController.buscarTravaPeriodo);

router.patch('/', verificaAutenticacao.autenticar, travaPeriodoController.atualizarTravaPeriodo);

module.exports = router;
