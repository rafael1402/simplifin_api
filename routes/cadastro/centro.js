/*Ferramentas*/
const express = require("express");
const verificaAutenticacao = require('../../services/autenticacao')

/*Rota*/
const router = express.Router();

/*Controller*/
const formaPagamentoController = require('../../controllers/cadastro/centro')

router.post('', verificaAutenticacao.autenticar, formaPagamentoController.criarCentro);

router.get('', verificaAutenticacao.autenticar, formaPagamentoController.listarCentros);

router.get('/:id', verificaAutenticacao.autenticar, formaPagamentoController.buscarCentro);

router.patch('/:id', verificaAutenticacao.autenticar, formaPagamentoController.atualizarCentro);

router.delete('/:id', verificaAutenticacao.autenticar, formaPagamentoController.deletarCentro);

module.exports = router;
