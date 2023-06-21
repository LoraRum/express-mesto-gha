const { celebrate, Joi } = require('celebrate');

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUpdateProfile = celebrate(
  {
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  },
);

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
  }),
});

const validateCreateCard = celebrate(
  {
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().required().uri({ scheme: ['http', 'https'] }),
    }),
  },
);

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  validateLogin,
  validateUpdateProfile,
  validateCreateCard,
  validateCreateUser,
  validateUpdateAvatar,
  validateUserId,
  validateCardId,
};
