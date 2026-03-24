import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
   try {
      const app = await NestFactory.create(AppModule);
      console.log('App created successfully');
      await app.listen(process.env.PORT ?? 3004);
      console.log(`Server running on port ${process.env.PORT ?? 3004}`);
   } catch (err) {
      console.error('Bootstrap error:', err);
      process.exit(1);
   }
}
bootstrap();