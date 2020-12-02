const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const receitaSchema = mongoose.Schema({
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
    require: true
  },
  conta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conta",
    require: true,
  },
  repeticaoTipo: {
    type: String,
    require: true
  },
  repeticao: {
    type: Number,
    require: true
  },
  data: {
    type: Date,
    require: true,
    default: Date.now
  },
  valor: {
    type: Number,
    require: true
  },
  documento: {
    type: String
  },
  descricao: {
    type: String
  },
  observacao: {
    type: String
  },
  tag: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
  }],
  _criador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    require: true
  }
})

module.exports = mongoose.model('Receita', receitaSchema);
