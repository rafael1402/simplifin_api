const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const uniqueValidator = require('mongoose-unique-validator');

const usuarioSchema = mongoose.Schema({
  nomeCompleto: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  senha: {
    type: String
  },
  premium: {
    type: Number,
    require: true,
  }
})

usuarioSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Usuario', usuarioSchema);
