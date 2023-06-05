const express = require('express');
const cardController = require('../controllers/cards');

const router = express.Router();

router.get('/', cardController.getAllCards);
router.post('/', cardController.createCard);
router.delete('/:cardId', cardController.deleteCardById);

module.exports = router;
