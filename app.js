/*Ferramentas*/
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

/*Conexão com o banco de dados */
require('./config/database')

/*Rotas - Cadastro*/
const usuarioRoutes = require('./routes/cadastro/usuario');
const categoriaRoutes = require('./routes/cadastro/categoria');
const formaPagamentoRouters = require('./routes/cadastro/forma-pagamento');
const centroRouters = require('./routes/cadastro/centro');
const contaRouters = require('./routes/cadastro/conta');
const tagRouters = require('./routes/cadastro/tag');

/*Rotas - transações*/
const despesaRouters = require('./routes/lancamentos/despesa');
const receitaRouters = require('./routes/lancamentos/receita');
const transferenciaRouters = require('./routes/lancamentos/transferencia');
const travaPeriodoRouters = require('./routes/lancamentos/travaPeriodo');

/*Rotas - metas*/
const metaRouters = require('./routes/metas/meta');

/*Rotas - relatórios*/
const relatoriosRouters = require('./routes/relatorios/relatorios');

const app = express();

/*Para resolver o problema do CORS*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorazation');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS, PUT, PATCH');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/api/usuario', usuarioRoutes);
app.use('/api/categoria', categoriaRoutes);
app.use('/api/forma-pagamento', formaPagamentoRouters);
app.use('/api/centro', centroRouters);
app.use('/api/conta', contaRouters);
app.use('/api/tag', tagRouters);

app.use('/api/despesa', despesaRouters);
app.use('/api/receita', receitaRouters);
app.use('/api/transferencia', transferenciaRouters);
app.use('/api/trava-periodo', travaPeriodoRouters);

app.use('/api/meta', metaRouters);

app.use('/api/relatorios', relatoriosRouters);

/*
//Front End
app.use("/", express.static(path.join(__dirname, "dist")));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
*/

module.exports = app;
