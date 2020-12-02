const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

function validaTipo(val) {
  return val === 'R' || val === 'D';
}

const tipoMsg = [validaTipo, 'Apenas tipos C (corrente) e P (poupança) e I (investimentos) são validos']

const contaSchema = mongoose.Schema({
  tipo: {
    type: String,
    require: true,
    validator: tipoMsg
  },
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

module.exports = mongoose.model('Conta', contaSchema);
