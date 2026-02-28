export default () => ({
   port: parseInt(process.env.PORT ?? '3000', 10),
   app_url: process.env.APP_URL,
   redis_url: process.env.REDIS_URL,
   RABBITMQ_URI: process.env.RABBITMQ_URI
})