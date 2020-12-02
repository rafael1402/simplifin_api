const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://simplifin_user:DJqh4AVcJ6b3ODv1@lebarch-abhug.mongodb.net/simplifin_db?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => {
  console.log('Connected to database');
}).catch((err) => {
  console.log(err);
});
