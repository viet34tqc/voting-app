import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { PollsService } from './polls.service';

// We can connect to ws via ws://localhost:8000/
// By default, the port of ws is equal to the port of the app
@WebSocketGateway(8000, { namespace: '/polls' })
export class PollsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PollsGateway.name);
  constructor(private readonly pollService: PollsService) {}

  // We are using socket io namespace to allow multiple polls using single connection
  @WebSocketServer()
  io: Namespace;

  // These method is required when we implement those lifecycle hooks above
  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }
  handleConnection(client: Socket) {
    const sockets = this.io.sockets;
    this.logger.log(`Client connected: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    this.io.emit('hello', `from ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;
    this.logger.log(`Client disconected: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }
}
