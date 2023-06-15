const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ERROR_CODE } = require('../constsns/constans');
const User = require('../models/user');

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
      res.status(ERROR_CODE.NOT_FOUND).json({ message: 'User not found' });
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
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password,
    });

    res.status(201).json({ data: newUser });
  } catch (err) {
    next(err);
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
      res.status(ERROR_CODE.NOT_FOUND).json({ message: 'User not found' });
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
      res.status(ERROR_CODE.NOT_FOUND).json({ message: 'User not found' });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
      expiresIn: '7d',
    });

    response.cookie('jwt', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    response.send({ token });
  } catch (error) {
    next(error);
  }
};
