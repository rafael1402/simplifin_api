const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const metaItemSchema = mongoose.Schema({
  meta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meta",
    require: true
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
    require: true
  },
  valor: {
    type: Number,
    require: true
  },
  _criador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    require: true
  }
})

module.exports = mongoose.model('MetaItem', metaItemSchema);
