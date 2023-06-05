const Card = require('../models/card');

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
      res.status(400).json({ error: 'Invalid card data' });
    } else {
      next(err);
    }
  }
};

// Delete a card by ID
module.exports.deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.status(200).json({ message: 'Card deleted successfully' });
  } catch (err) {
    next(err);
  }
};
