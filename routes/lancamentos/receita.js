/*Ferramentas*/
const express = require("express");
const verificaAutenticacao = require('../../services/autenticacao')

/*Rota*/
const router = express.Router();

/*Controller*/
const receitaController = require('../../controllers/lancamentos/receita')

router.post('', verificaAutenticacao.autenticar, receitaController.verificaPeriodo, receitaController.criarReceita);

router.get('', verificaAutenticacao.autenticar, receitaController.listarReceitas);

router.get('/:id', verificaAutenticacao.autenticar, receitaController.buscarReceita);

router.patch('/:id', verificaAutenticacao.autenticar, receitaController.verificaPeriodo, receitaController.atualizarReceita);

router.delete('/:id', verificaAutenticacao.autenticar, receitaController.verificaPeriodo, receitaController.deletarReceita);

module.exports = router;
