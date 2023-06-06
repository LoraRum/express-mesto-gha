const User = require('../models/user');

const ERROR_CODE = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_CODE.SERVER_ERROR).json({ message: 'An error occurred on the server' }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE.NOT_FOUND).json({ message: 'User not found' });
      }
      res.send({ data: user });
    })
    .catch(() => res.status(ERROR_CODE.SERVER_ERROR).json({ message: 'An error occurred on the server' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => res.status(201).send({ data: newUser }))
    .catch(() => res.status(ERROR_CODE.SERVER_ERROR).json({ message: 'An error occurred on the server' }));
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true },
    );
    if (!updatedUser) {
      return res.status(ERROR_CODE.NOT_FOUND).json({ message: 'User not found' });
    }

    res.send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE.BAD_REQUEST).json({ message: err.message || 'Invalid user data' });
    } else {
      next(err);
    }
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
      return res.status(ERROR_CODE.NOT_FOUND).json({ message: 'User not found' });
    }

    res.send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE.BAD_REQUEST).json({ message: err.message || 'Invalid avatar data' });
    } else {
      next(err);
    }
  }
};
