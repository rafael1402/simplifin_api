const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const metaSchema = mongoose.Schema({
  descricao: {
    type: String,
    require: true
  },
  dataInicio: {
    type: Date,
    require: true
  },
  dataFim: {
    type: Date,
    require: true
  },
  _criador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    require: true
  }
})

module.exports = mongoose.model('Meta', metaSchema);
