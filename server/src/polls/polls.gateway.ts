import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { NominationDto } from './dto/nomination.dto';
import { PollsWsGuard } from './guards/polls-ws.guard';
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

  // Client has type SocketWithAuth because we have added customized payload to the socket in adapter
  async handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    this.logger.log(`Client connected: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
    this.logger.debug(
      `Socket connected with userId: ${client.userId}, pollId: ${client.pollId}, and name: "${client.name}"`,
    );

    const roomName = client.pollId;
    client.join(roomName);

    const connectedClients = this.io.adapter.rooms?.get(roomName).size ?? 0;

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

    // Whenever a user joins the room, we update poll
    // And send it back to all clients
    // .to(roomName) to specify that we only want to send the message to all connected clients in roomName
    // The clients must listen to poll_updated event
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

  @UseGuards(PollsWsGuard)
  @SubscribeMessage('remove_participant')
  async removeParticipant(
    @MessageBody('id') id: string,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    this.logger.debug(
      `Attempting to remove participant ${id} from poll ${client.pollId}`,
    );

    const updatedPoll = await this.pollsService.removeParticipant(
      client.pollId,
      id,
    );

    if (updatedPoll) {
      this.io.to(client.pollId).emit('poll_updated', updatedPoll);
    }
  }

  @SubscribeMessage('nominate')
  async nominate(
    @MessageBody() nomination: NominationDto,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    this.logger.debug(
      `Attempting to add nomination for user ${client.userId} to poll ${client.pollId}\n${nomination.text}`,
    );

    const updatedPoll = await this.pollsService.addNomination({
      pollId: client.pollId,
      userId: client.userId,
      text: nomination.text,
    });

    this.io.to(client.pollId).emit('poll_updated', updatedPoll);
  }

  @SubscribeMessage('remove_nomination')
  @UseGuards(PollsWsGuard)
  async removeNomination(
    @MessageBody('id') nominationId: string,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    this.logger.debug(
      `Attempting to remove nomination ${nominationId} from poll ${client.pollId}`,
    );

    const updatedPoll = await this.pollsService.removeNomination(
      client.pollId,
      nominationId,
    );

    this.io.to(client.pollId).emit('poll_updated', updatedPoll);
  }
}
