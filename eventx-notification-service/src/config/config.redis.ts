
export default () => ({
   REDIS_PORT: process.env.REDIS_PORT ?? 6379,
   REDIS_HOST: process.env.REDIS_HOST
})