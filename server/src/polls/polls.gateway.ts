import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { PollsService } from './polls.service';
import { SocketWithAuth } from './types';

// We can connect to ws via ws://localhost:8000/polls or ws://localhost:8000
// By default, the port of ws is equal to the port of the server
// Namespace is optional, however it's recommended to use it
@WebSocketGateway(8000, { namespace: '/polls' })
export class PollsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PollsGateway.name);
  constructor(private readonly pollsService: PollsService) {}

  // https://docs.nestjs.com/websockets/gateways#server-and-namespace
  // This decorator injects the WebSocket server instance (Socket.io instance) into the gateway, enabling direct communication with connected clients.
  @WebSocketServer()
  io: Namespace;

  // These method is required when we implement those lifecycle hooks above
  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }
  async handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    this.logger.log(`Client connected: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
    this.logger.debug(
      `Socket connected with userId: ${client.userId}, pollId: ${client.pollId}, and name: "${client.name}"`,
    );

    const roomName = client.pollId;
    client.join(roomName);

    const connectedClients = this.io.adapter.rooms.get(roomName).size;

    this.logger.debug(
      `userID: ${client.userId} joined room with name: ${roomName}`,
    );
    this.logger.debug(
      `Total clients connected to room '${roomName}': ${connectedClients}`,
    );

    const updatedPoll = await this.pollsService.addParticipant({
      pollId: client.pollId,
      userId: client.userId,
      name: client.name,
    });

    // Whenever a user joins the room, we updated poll
    // And send it back to all clients
    // .to(roomName) to specify that we only want to send the message to all connected clients in roomName
    // The clients must listen to poll_updated even
    // This is broadcasting technique
    this.io.to(roomName).emit('poll_updated', updatedPoll);
  }
  async handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    const { pollId, userId } = client;
    const updatedPoll = await this.pollsService.removeParticipant(
      pollId,
      userId,
    );

    const roomName = pollId;
    const clientCount = this.io.adapter.rooms.get(roomName)?.size ?? 0;

    this.logger.log(`Client disconected: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
    this.logger.debug(
      `Total clients connected to room '${roomName}': ${clientCount}`,
    );

    if (updatedPoll) {
      this.io.to(pollId).emit('poll_updated', updatedPoll);
    }
  }
}
