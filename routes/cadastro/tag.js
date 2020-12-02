/*Ferramentas*/
const express = require("express");
const verificaAutenticacao = require('../../services/autenticacao')

/*Rota*/
const router = express.Router();

/*Controller*/
const tagController = require('../../controllers/cadastro/tag')

router.post('', verificaAutenticacao.autenticar, tagController.criarTag);

router.get('', verificaAutenticacao.autenticar, tagController.listarTags);

router.get('/:id', verificaAutenticacao.autenticar, tagController.buscarTag);

router.patch('/:id', verificaAutenticacao.autenticar, tagController.atualizarTag);

router.delete('/:id', verificaAutenticacao.autenticar, tagController.deletarTag);

module.exports = router;
