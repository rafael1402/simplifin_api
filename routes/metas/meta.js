/*Ferramentas*/
const express = require("express");
const verificaAutenticacao = require('../../services/autenticacao')

/*Rota*/
const router = express.Router();

/*Controller*/
const metaController = require('../../controllers/metas/meta')

router.post('', verificaAutenticacao.autenticar, verificaAutenticacao.varificarPermissao, metaController.validaMeta, metaController.criarMeta);

router.get('', verificaAutenticacao.autenticar, verificaAutenticacao.varificarPermissao, metaController.listarMetas);

router.get('/:id', verificaAutenticacao.autenticar, verificaAutenticacao.varificarPermissao, metaController.buscarMeta);

router.get('/acompanhar/:id', verificaAutenticacao.autenticar, verificaAutenticacao.varificarPermissao, metaController.acompanharMeta);

router.patch('/:id', verificaAutenticacao.autenticar, verificaAutenticacao.varificarPermissao, metaController.validaMeta, metaController.atualizarMeta);

router.delete('/:id', verificaAutenticacao.autenticar, verificaAutenticacao.varificarPermissao, metaController.deletarMeta);

module.exports = router;
