/*Ferramentas*/
const express = require("express");
const verificaAutenticacao = require('../../services/autenticacao')

/*Rota*/
const router = express.Router();

/*Controller*/
const categoriaController = require('../../controllers/cadastro/categoria')

router.post('', verificaAutenticacao.autenticar, categoriaController.criarCategoria);

router.get('', verificaAutenticacao.autenticar, categoriaController.listarCategorias);

router.get('/:id', verificaAutenticacao.autenticar, categoriaController.buscarCategoria);

router.patch('/:id', verificaAutenticacao.autenticar, categoriaController.atualizarCategoria);

router.delete('/:id', verificaAutenticacao.autenticar, categoriaController.deletarCategoria);

module.exports = router;
