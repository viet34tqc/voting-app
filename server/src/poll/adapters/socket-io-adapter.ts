import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

// We use this custom adapater to config SocketIO server with custom CORS options
// Why: because we need to get CLIENT_HOST from .env

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const clientHost = this.configService.get('CLIENT_HOST');

    const cors = {
      origin: [clientHost],
    };

    this.logger.log('Configuring SocketIO server with custom CORS options', {
      cors,
    });

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    // we need to return this, even though the signature says it returns void
    return super.createIOServer(port, optionsWithCORS);
  }
}
