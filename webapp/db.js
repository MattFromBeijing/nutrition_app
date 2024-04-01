const mongoose = require('mongoose');

const dbURI = 'mongodb+srv://matthew:powerkids@cluster0.laeskgp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected!'))
  .catch((err) => console.error('Connection error', err));

module.exports = mongoose;