import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the Next.js frontend
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  });

  // Global API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Language Tutor API running on http://localhost:${port}/api`);
}

bootstrap();
