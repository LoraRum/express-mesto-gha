const express = require('express');
const cardController = require('../controllers/cards');

const router = express.Router();

router.get('/', cardController.getAllCards);
router.post('/', cardController.createCard);
router.delete('/:cardId', cardController.deleteCardById);
router.put('/:cardId/likes', cardController.likeCard);
router.delete('/:cardId/likes', cardController.dislikeCard);

module.exports = router;
