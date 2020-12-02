const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


const formaPagamentoSchema = mongoose.Schema({
  descricao: {
    type: String,
    require: true
  },
  status: {
    type: Number,
    require: true

  },
  _criador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    require: true
  }
})

module.exports = mongoose.model('FormaPagamento', formaPagamentoSchema);
