const express = require('express');
const userController = require('../controllers/users');
const { validateUpdateProfile, validateUpdateAvatar, validateUserId } = require('../middlewares/validation');

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/me', userController.getCurrentUser);
router.get('/:userId', validateUserId, userController.getUserById);
router.patch('/me', validateUpdateProfile, userController.updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, userController.updateAvatar);

module.exports = router;
