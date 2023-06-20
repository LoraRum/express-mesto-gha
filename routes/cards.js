const express = require('express');
const cardController = require('../controllers/cards');
const { validateCreateCard, validateCardId } = require('../middlewares/validation');

const router = express.Router();

router.get('/', cardController.getAllCards);
router.post('/', validateCreateCard, cardController.createCard);
router.delete('/:cardId', validateCardId, cardController.deleteCardById);
router.put('/:cardId/likes', validateCardId, cardController.likeCard);
router.delete('/:cardId/likes', validateCardId, cardController.dislikeCard);

module.exports = router;
