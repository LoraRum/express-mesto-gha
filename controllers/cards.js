const Card = require('../models/card');

const ERROR_CODE = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Retrieve all cards
module.exports.getAllCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

// Create a new card
module.exports.createCard = async (req, res, next) => {
  try {
    const newCard = await Card.create({ ...req.body, owner: req.user._id });
    res.send(newCard);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.statusCode = ERROR_CODE.BAD_REQUEST;
      err.message = err.message; // Set error message from ValidationError
    }
    next(err);
  }
};

// Delete a card by ID
module.exports.deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);

    if (!card) {
      const err = new Error('Card not found');
      err.statusCode = ERROR_CODE.NOT_FOUND;
      throw err;
    }

    res.status(200).json({ message: 'Card deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Like a card
module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      const err = new Error('Card not found');
      err.statusCode = ERROR_CODE.NOT_FOUND;
      throw err;
    }

    res.send(card);
  } catch (err) {
    next(err);
  }
};

// Dislike a card
module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      const err = new Error('Card not found');
      err.statusCode = ERROR_CODE.NOT_FOUND;
      throw err;
    }

    res.send(card);
  } catch (err) {
    next(err);
  }
};
