/*Ferramentas*/
const express = require("express");
const verificaAutenticacao = require('../../services/autenticacao')

/*Rota*/
const router = express.Router();

/*Controller*/
const formaPagamentoController = require('../../controllers/cadastro/forma-pagamento')

router.post('', verificaAutenticacao.autenticar, formaPagamentoController.criarFormaPagamento);

router.get('', verificaAutenticacao.autenticar, formaPagamentoController.listarFormasPagamento);

router.get('/:id', verificaAutenticacao.autenticar, formaPagamentoController.buscarFormaPagamento);

router.patch('/:id', verificaAutenticacao.autenticar, formaPagamentoController.atualizarFormaPagamento);

router.delete('/:id', verificaAutenticacao.autenticar, formaPagamentoController.deletarFormaPagamento);

module.exports = router;
