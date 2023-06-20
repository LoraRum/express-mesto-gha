const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const Unauthorized = require('../errors/Unauthorized');

module.exports.getAllCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.json(cards);
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const newCard = await Card.create({ ...req.body, owner: req.user._id });
    res.send(newCard);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      next(new NotFound('Card not found'));
    } else if (card.owner !== req.user.id) {
      next(new Unauthorized('You are not the owner of this card'));
    } else {
      await Card.findByIdAndDelete(req.params.cardId);
      res.status(200).json({ message: 'Card deleted successfully' });
    }
  } catch (err) {
    next(err);
  }
};
module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    );

    if (!card) {
      next(new NotFound('Card not found'));
    } else {
      res.send(card);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true },
    );

    if (!card) {
      next(new NotFound('Card not found'));
    } else {
      res.send(card);
    }
  } catch (err) {
    next(err);
  }
};
