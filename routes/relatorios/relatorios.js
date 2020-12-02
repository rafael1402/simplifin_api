/*Ferramentas*/
const express = require("express");
const verificaAutenticacao = require('../../services/autenticacao')
const validarParametros = require('../../services/validarParametros')

/*Rota*/
const router = express.Router();

/*Controller*/
const relatoriosController = require('../../controllers/relatorios/relatorios')


router.get('/despesa-por-categoria', verificaAutenticacao.autenticar, validarParametros.validarDatas, relatoriosController.despesasPorCategoria);

router.get('/despesa-por-forma-pagamento', verificaAutenticacao.autenticar, validarParametros.validarDatas, relatoriosController.despesasPorFormaPagamento);

router.get('/receita-por-categoria', verificaAutenticacao.autenticar, validarParametros.validarDatas, relatoriosController.receitasPorCategoria);

router.get('/balanco-contas', verificaAutenticacao.autenticar, validarParametros.validarDatas, relatoriosController.balancoContas);

router.get('/top-despesas', verificaAutenticacao.autenticar, validarParametros.validarDatas, relatoriosController.topDespesas);

router.get('/top-receitas', verificaAutenticacao.autenticar, validarParametros.validarDatas, relatoriosController.topReceitas);

router.get('/balanco-mensal', verificaAutenticacao.autenticar, validarParametros.validarDatas, relatoriosController.balancoMensal);

module.exports = router;
