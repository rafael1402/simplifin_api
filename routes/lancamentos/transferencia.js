/*Ferramentas*/
const express = require("express");
const verificaAutenticacao = require('../../services/autenticacao')

/*Rota*/
const router = express.Router();

/*Controller*/
const transferenciaController = require('../../controllers/lancamentos/transferencia')

router.post('', verificaAutenticacao.autenticar, transferenciaController.verificaPeriodo, transferenciaController.criarTransferencia);

router.get('', verificaAutenticacao.autenticar, transferenciaController.listarTransferencias);

router.get('/:id', verificaAutenticacao.autenticar, transferenciaController.buscarTransferencia);

router.patch('/:id', verificaAutenticacao.autenticar, transferenciaController.verificaPeriodo, transferenciaController.atualizarTransferencia);

router.delete('/:id', verificaAutenticacao.autenticar, transferenciaController.verificaPeriodo, transferenciaController.deletarTransferencia);

module.exports = router;
