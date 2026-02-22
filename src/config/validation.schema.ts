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

   REDIS_HOST: Joi.string().required(),
   REDIS_PORT: Joi.number().required(),
   REDIS_USERNAME: Joi.string().required(),
   REDIS_PASSWORD: Joi.string().required(),

   CLOUDINARY_NAME: Joi.string().required(),
   CLOUDINARY_KEY: Joi.string().required(),
   CLOUDINARY_SECRET: Joi.string().required(),

   APP_URL: Joi.string().required(),
   SWAGGER_URL: Joi.string().required(),
   NODE_ENV: Joi.string().required(),
   FRONTEND_URL: Joi.string().required(),

   STRIPE_SECRET_KEY: Joi.string().required(),
   //STRIPE_WEBHOOK_SECRET: Joi.string().required()

   RABBITMQ_URI: Joi.string().required()
});