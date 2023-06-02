const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');

const {PORT = 3001, BASE_PATH} = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const app = express();

app.use(express.json());
app.use('/users', users);

app.listen(PORT, () => {
  console.log('Server is running');
  console.log(BASE_PATH);
});
