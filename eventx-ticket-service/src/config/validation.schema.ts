import * as Joi from 'joi';

export const validationSchema = Joi.object({

   NODE_ENV: Joi.string().required(),

   PORT: Joi.number().default(3003),

   TICKET_MONGO_URI: Joi.string().required(),

   REDIS_HOST: Joi.string().required(),
   REDIS_PORT: Joi.number().required(),

   SWAGGER_URL: Joi.string().required(),

   INTERNAL_API_KEY: Joi.string().required()
});