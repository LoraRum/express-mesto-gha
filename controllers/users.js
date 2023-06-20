const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secretKey = require('../constsns/secret-key');
const BadRequest = require('../errors/BadRequest');
const ConflictError = require('../errors/ConflictError');
const NotFound = require('../errors/NotFound');
const Unauthorized = require('../errors/Unauthorized');

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    next(err);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (user) {
      res.json({ data: user });
    } else {
      res.status(NotFound).json({ message: 'User not found' });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ data: newUser });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(BadRequest).json({ message: 'Incorrect data passed during user creation' });
    } else if (error.name === 'MongoServerError') {
      res.status(ConflictError).json({ message: 'When registering, an email is specified that already exists on the server' });
    } else {
      next(error);
    }
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (updatedUser) {
      res.send(updatedUser);
    } else {
      res.status(NotFound).json({ message: 'User not found' });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    );

    if (updatedUser) {
      res.send(updatedUser);
    } else {
      res.status(NotFound).json({ message: 'User not found' });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (request, response) => {
  try {
    const { email, password } = request.body;

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, secretKey, {
      expiresIn: '7d',
    });

    response.cookie('jwt', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    response.send({ token });
  } catch (error) {
    response.status(Unauthorized).json({ message: 'Invalid email or password' });
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const user = await User.findOne({ _id });
    user.password = undefined;

    res.send({ user });
  } catch (error) {
    if (error.name === 'NotFoundError') {
      res.status(NotFound).json({ message: error.message });
    } else {
      next(error);
    }
  }
};
