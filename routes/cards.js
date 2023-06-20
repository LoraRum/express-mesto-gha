const express = require('express');
const cardController = require('../controllers/cards');
const { validateCreateCard } = require('../middlewares/validation');

const router = express.Router();

router.get('/', cardController.getAllCards);
router.post('/', validateCreateCard, cardController.createCard);
router.delete('/:cardId', cardController.deleteCardById);
router.put('/:cardId/likes', cardController.likeCard);
router.delete('/:cardId/likes', cardController.dislikeCard);

module.exports = router;
