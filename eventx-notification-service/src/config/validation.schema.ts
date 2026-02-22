import * as Joi from 'joi';

export const validationSchema = Joi.object({

   NODE_ENV: Joi.string().required(),

   PORT: Joi.number().default(3000),

   MAIL_USER: Joi.string().email().required(),
   MAIL_PASSWORD: Joi.string().required(),
   MAIL_HOST: Joi.string().required(),
   MAIL_PORT: Joi.number().required(),

   REDIS_HOST: Joi.string().required(),
   REDIS_PORT: Joi.number().required(),

   RABBITMQ_URI: Joi.string().required()
});