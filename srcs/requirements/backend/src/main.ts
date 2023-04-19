import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: "http://localhost:3000", methods: 'GET, POST, PUT, PATCH', allowedHeaders: "Content-Type, Accept, Authorization"})
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // protect against data not set in the DTO
  await app.listen(5000);
}
bootstrap();
