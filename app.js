const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const users = require('./routes/users');
const cards = require('./routes/cards');
const handleError = require('./middlewares/error-processing');
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

  app.all(['/users*', '/cards*'], auth);

  app.post('/signin', login);
  app.post('/signup', createUser);

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

    next({
      message: err.message,
    });
  });

  app.use((err, req, res, next) => {
    if (res.headersSent) {
      next(err);
    } else {
      res.json(err);
    }
  });

  app.use((req, res) => {
    res.status(404).json({
      message: "Sorry can't find that!",
    });
  });

  app.use(errors());

  app.use(handleError);

  app.listen(PORT, (error) => {
    if (error) {
      console.error('Server failed to start:', error);
    } else {
      console.info('Server is running');
    }
  });
});
