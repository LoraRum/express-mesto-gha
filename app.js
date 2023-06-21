const express = require('express');
const mongoose = require('mongoose');
const BodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const users = require('./routes/users');
const cards = require('./routes/cards');
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
  app.use(cookieParser());

  app.use(express.json());
  app.use(BodyParser.json());

  app.all(['/users*', '/cards*'], auth);

  app.post('/signin', validateLogin, login);
  app.post('/signup', validateCreateUser, createUser);

  app.use('/users', users);
  app.use('/cards', cards);

  app.use(errors());

  app.use((err, req, res, next) => {
    if (err.name === 'CastError') {
      next(new BadRequest());
    }

    next(err);
  });

  app.use((err, req, res, next) => {
    if (res.headersSent) {
      next(err);
    } else {
      res
        .status(err.statusCode || 500)
        .json({ message: err.message || 'Server Exception' });
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
