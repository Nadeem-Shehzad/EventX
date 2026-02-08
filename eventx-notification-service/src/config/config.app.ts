
export default () => ({
   PORT: parseInt(process.env.PORT ?? '3001', 10),
   NODE_ENV: process.env.NODE_ENV
})