/*Ferramentas*/
const express = require("express");
const verificaAutenticacao = require('../../services/autenticacao')

/*Rota*/
const router = express.Router();

/*Controller*/
const usuarioController = require('../../controllers/cadastro/usuario')

router.post('/', usuarioController.criarUsuario );

router.get('/', verificaAutenticacao.autenticar, usuarioController.buscarUsuario );

router.patch('', verificaAutenticacao.autenticar, usuarioController.atualizarUsuario );

router.patch('/atualizar-senha', verificaAutenticacao.autenticar, usuarioController.atualizarSenha );

router.patch('/ativar-premium', verificaAutenticacao.autenticar, usuarioController.ativarPremium );

router.post('/login', usuarioController.login );

router.post('/social-login', usuarioController.socialLogin );

module.exports = router;
