const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log('Server is running');
  console.log(BASE_PATH);
});
