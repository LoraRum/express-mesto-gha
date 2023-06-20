const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ERROR_CODE } = require('../constsns/constans');
const User = require('../models/user');
const secretKey = require('../constsns/secret-key');

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
      res.status(ERROR_CODE.BAD_REQUEST).json({ message: 'Incorrect data passed during user creation' });
    } else if (error.name === 'MongoServerError') {
      res.status(ERROR_CODE.CONFLICT_ERROR).json({ message: 'When registering, an email is specified that already exists on the server' });
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

// todo: test it with postman, it should return 401 in case of wrong credentials
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
    response.status(401).json({ message: 'Invalid email or password' });
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
      res.status(ERROR_CODE.NOT_FOUND).json({ message: error.message });
    } else {
      next(error);
    }
  }
};
