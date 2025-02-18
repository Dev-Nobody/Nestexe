import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with necessary configurations
  app.enableCors({
    origin: '*', // Allow your frontend's origin
    methods: ['GET', 'POST', 'OPTIONS'], // Allow PATCH method
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
    credentials: true, // If using authentication/cookies
    preflightContinue: false,
    optionsSuccessStatus: 204, // Standard success response for OPTIONS
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
