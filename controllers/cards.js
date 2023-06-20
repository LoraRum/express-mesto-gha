const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');

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
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      next(new NotFound('Card not found'));
    } else if (card.owner.toString() !== req.user._id) {
      next(new Forbidden('Deletion is not possible'));
    } else {
      const deletedCard = await Card.findByIdAndRemove(cardId);

      if (!deletedCard) {
        next(new NotFound('Card not found'));
      } else {
        res.status(200).json(deletedCard);
      }
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Incorrect data provided'));
    } else {
      next(err);
    }
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
