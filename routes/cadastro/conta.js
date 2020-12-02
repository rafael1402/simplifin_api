/*Ferramentas*/
const express = require("express");
const verificaAutenticacao = require('../../services/autenticacao')

/*Rota*/
const router = express.Router();

/*Controller*/
const contaController = require('../../controllers/cadastro/conta')

router.post('', verificaAutenticacao.autenticar, contaController.criarConta);

router.get('', verificaAutenticacao.autenticar, contaController.listarContas);

router.get('/:id', verificaAutenticacao.autenticar, contaController.buscarConta);

router.patch('/:id', verificaAutenticacao.autenticar, contaController.atualizarConta);

router.delete('/:id', verificaAutenticacao.autenticar, contaController.deletarConta);

module.exports = router;
