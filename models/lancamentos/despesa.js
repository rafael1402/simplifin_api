const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const despesaSchema = mongoose.Schema({
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
  formaPagamento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FormaPagamento",
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
  baixado: {
    type: Number,
    require: true,
    default: 0
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
  centro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Centro",
  },
  percentualRateio: {
    type: Number,
  },
  valorRateio: {
    type: Number,
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

module.exports = mongoose.model('Despesa', despesaSchema);
