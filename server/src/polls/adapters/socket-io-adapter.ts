import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { SocketWithAuth } from '../types';

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

    // Retrieve an instance of injectable provider. In this case, it's JwtService
    const jwtService = this.app.get(JwtService);
    const server = super.createIOServer(port, optionsWithCORS);

    server.of('polls').use(createTokenMiddleware(jwtService, this.logger));

    // we need to return this, even though the signature says it returns void
    return server;
  }
}

// This function returns a socket.io middleware
// docs: https://socket.io/docs/v4/middlewares/.
const createTokenMiddleware =
  (jwtService: JwtService, logger) => (socket: SocketWithAuth, next) => {
    // The client can send credentials with the auth option. And those credentials can be accessed in the handshake object on the server-side:
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    logger.debug(`Validating auth token before WS connection: ${token}`);

    try {
      const payload = jwtService.verify(token);
      socket.userId = payload.sub;
      socket.pollId = payload.pollID;
      socket.name = payload.name;
      // If everything's ok, go next();
      next();
    } catch (error) {
      next(new Error('Forbidden'));
    }
  };
