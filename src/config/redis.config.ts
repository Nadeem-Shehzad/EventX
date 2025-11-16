export default () => ({
   redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT ?? '15448', 10),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
   }
});