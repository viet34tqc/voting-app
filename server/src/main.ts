import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const serverPort = configService.get('SERVER_PORT');
  app.enableCors({ origin: configService.get('CLIENT_URL') });
  await app.listen(serverPort);
}
bootstrap();
