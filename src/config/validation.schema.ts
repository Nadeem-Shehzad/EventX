import * as Joi from 'joi';

export const validationSchema = Joi.object({
   PORT: Joi.number().default(3000),

   MONGO_URI: Joi.string().required(),

   JWT_SECRET: Joi.string().min(10).required(),
   JWT_EXPIRES: Joi.string().default('1d'),

   MAIL_USER: Joi.string().email().required(),
   MAIL_PASSWORD: Joi.string().required(),
   MAIL_HOST: Joi.string().required(),
   MAIL_PORT: Joi.number().required(),

   APP_URL: Joi.string().required(),
});