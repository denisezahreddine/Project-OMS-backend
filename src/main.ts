import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DomainExceptionFilter} from "./domain/exceptions/DomainExceptionFilter";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Applique le filtre à TOUTE l'application
  app.useGlobalFilters(new DomainExceptionFilter());
  // Étape CRUCIALE pour class-validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       // Supprime les propriétés non définies dans le DTO
    forbidNonWhitelisted: true, // Rejette la requête si des propriétés inconnues sont présentes
    transform: true,       // Transforme le payload JSON en instance de la classe DTO
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
