const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://alagiri:0077@cluster0.bxnbscz.mongodb.net/riyatex?retryWrites=true&w=majority')
  .then(() => { console.log('SUCCESS'); process.exit(0); })
  .catch(err => { console.error('ERROR:', err.message); process.exit(1); });
