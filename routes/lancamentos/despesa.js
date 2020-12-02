/*Ferramentas*/
const express = require("express");
const verificaAutenticacao = require('../../services/autenticacao')

/*Rota*/
const router = express.Router();

/*Controller*/
const despesaController = require('../../controllers/lancamentos/despesa')

router.post('', verificaAutenticacao.autenticar, despesaController.verificaPeriodo, despesaController.criarDespesa);

router.get('', verificaAutenticacao.autenticar, despesaController.listarDespesas);

router.get('/:id', verificaAutenticacao.autenticar, despesaController.buscarDespesa);

router.patch('/:id', verificaAutenticacao.autenticar, despesaController.verificaPeriodo, despesaController.atualizarDespesa);

router.delete('/:id', verificaAutenticacao.autenticar, despesaController.verificaPeriodo, despesaController.deletarDespesa);

module.exports = router;
