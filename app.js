const express = require('express');
const mongoose = require('mongoose');
const BodyParser = require('body-parser');
const { errors, isCelebrateError } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const users = require('./routes/users');
const cards = require('./routes/cards');
const handleError = require('./middlewares/error-processing');
const { ERROR_CODE } = require('./constsns/constans');
const { validateLogin, validateCreateUser } = require('./middlewares/validation');
const { BadRequest } = require('./errors/errors');

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
  app.use(BodyParser.json());

  app.all(['/users*', '/cards*'], auth);

  app.post('/signin', validateLogin, login);
  app.post('/signup', validateCreateUser, createUser);

  app.use('/users', users);
  app.use('/cards', cards);

  app.use(errors());

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

  app.listen(PORT, (error) => {
    if (error) {
      console.error('Server failed to start:', error);
    } else {
      console.info('Server is running');
    }
  });
});
