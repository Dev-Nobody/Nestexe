import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // Allow the React frontend only
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'], // Allow necessary methods including OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow the necessary headers
    preflightContinue: false, // Do not pass the preflight request to the next handler
    optionsSuccessStatus: 204, // The success status for OPTIONS requests
  });

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow frontend
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
