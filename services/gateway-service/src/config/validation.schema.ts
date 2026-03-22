import * as Joi from 'joi';

export const validationSchema = Joi.object({

   NODE_ENV: Joi.string().required(),

   PORT: Joi.number().default(3002),

   // REDIS_HOST: Joi.string().required(),
   // REDIS_PORT: Joi.number().required(),
   // REDIS_USERNAME: Joi.string().required(),
   // REDIS_PASSWORD: Joi.string().required(),

   // SWAGGER_URL: Joi.string().required(),

   INTERNAL_API_KEY: Joi.string().required(),
   BOOKING_SERVICE_URL: Joi.string().required(),
   CATALOG_SERVICE_URL: Joi.string().required(),
   IDENTITY_SERVICE_URL: Joi.string().required(),
});