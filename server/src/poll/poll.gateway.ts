import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { PollService } from './poll.service';

@WebSocketGateway()
export class PollGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PollGateway.name);
  constructor(private readonly pollService: PollService) {}

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
  }
  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;
    this.logger.log(`Client disconected: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }
}
