import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';


export const corsConfig = (): CorsOptions => ({
   origin: (origin, callback) => {
      const allowed = process.env.FRONTEND_URL;

      // Allow API tools like Postman (no origin)
      if (!origin) return callback(null, true);

      if (origin === allowed) return callback(null, true);

      return callback(new Error('Not allowed by CORS'), false);
   },
   credentials: true,
});
