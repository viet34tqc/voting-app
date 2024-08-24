import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIOAdapter } from './polls/adapters/socket-io-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const serverPort = configService.get('SERVER_PORT');
  app.enableCors({ origin: configService.get('CLIENT_HOST') });
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));
  await app.listen(serverPort);
}
bootstrap();
