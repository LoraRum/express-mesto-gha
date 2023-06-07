const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { ERROR_CODE } = require('./constsns/constans');

const { PORT = 3000 } = process.env;
const db = mongoose.connection;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', console.info.bind(console, 'Connected to MongoDB'));

db.once('open', () => {
  const app = express();

  app.use(express.json());

  app.use((req, res, next) => {
    req.user = {
      _id: '647a095802421e3d1f193301',
    };
    next();
  });

  app.use('/users', users);
  app.use('/cards', cards);

  app.use((err, req, res, next) => {
    switch (err.name) {
      case 'ValidationError':
      case 'CastError':
        res.statusCode = ERROR_CODE.BAD_REQUEST;
        break;

      default:
        res.statusCode = err.statusCode || ERROR_CODE.SERVER_ERROR;
        break;
    }

    next(err);
  });

  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }

    res.json(err);
  });

  app.listen(PORT, (error) => {
    if (error) {
      console.error('Server failed to start:', error);
    } else {
      console.log('Server is running');
    }
  });
});
