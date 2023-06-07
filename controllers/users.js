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

    if (!user) {
      const err = new Error('User not found');
      err.statusCode = ERROR_CODE.NOT_FOUND;
      throw err;
    }

    res.json({ data: user });
  } catch (err) {
    next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });

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
    if (!updatedUser) {
      return res.status(ERROR_CODE.NOT_FOUND).json({ message: 'User not found' });
    }

    res.send(updatedUser);
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

    if (!updatedUser) {
      return res.status(ERROR_CODE.NOT_FOUND).json({ message: 'User not found' });
    }

    res.send(updatedUser);
  } catch (err) {
    next(err);
  }
};
