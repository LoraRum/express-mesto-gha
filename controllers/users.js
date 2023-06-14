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
