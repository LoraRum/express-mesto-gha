const User = require('../models/user');

const ERROR_CODE = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = ERROR_CODE.NOT_FOUND;
      throw err;
    }
    res.send({ data: user });
  } catch (err) {
    next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    res.status(201).send({ data: newUser });
  } catch (err) {
    next(err);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true },
    );
    if (!updatedUser) {
      const err = new Error('User not found');
      err.statusCode = ERROR_CODE.NOT_FOUND;
      throw err;
    }
    res.send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.statusCode = ERROR_CODE.BAD_REQUEST;
      err.message = err.message || 'Invalid user data';
    }
    next(err);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true },
    );
    if (!updatedUser) {
      const err = new Error('User not found');
      err.statusCode = ERROR_CODE.NOT_FOUND;
      throw err;
    }
    res.send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.statusCode = ERROR_CODE.BAD_REQUEST;
      err.message = err.message || 'Invalid avatar data';
    }
    next(err);
  }
};
