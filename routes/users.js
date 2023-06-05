const express = require('express');
const userController = require('../controllers/users');

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUserById);
router.post('/', userController.createUser);
router.patch('/me', userController.updateProfile);
router.patch('/me/avatar', userController.updateAvatar);

module.exports = router;
