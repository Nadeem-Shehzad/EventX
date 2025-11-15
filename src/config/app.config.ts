export default () => ({
   port: parseInt(process.env.PORT ?? '3000', 10),
   app_url: process.env.APP_URL
})