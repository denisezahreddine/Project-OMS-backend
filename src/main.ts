import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './presentation/filters/domain-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // Applique le filtre à TOUTE l'application
  app.useGlobalFilters(new DomainExceptionFilter());
  // Étape CRUCIALE pour class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non définies dans le DTO
      forbidNonWhitelisted: true, // Rejette la requête si des propriétés inconnues sont présentes
      transform: true, // Transforme le payload JSON en instance de la classe DTO
    }),
  );

    // Configuration de l'interface graphique
    const config = new DocumentBuilder()
        .setTitle('Ma Démo MongoDB')
        .setDescription('Interface de test pour mon backend')
        .setVersion('1.0')
        .addBearerAuth( // <--- Ajoute ceci
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Entrez votre token JWT',
                in: 'header',
            },
            'access-token', // C'est l'ID de sécurité qu'on réutilisera plus tard
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document); // L'interface sera sur /api
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
