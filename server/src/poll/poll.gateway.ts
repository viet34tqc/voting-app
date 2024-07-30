import { Logger } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class PollGateway {
  private readonly logger = new Logger(PollGateway.name);
  // Gateway initialized (provided in module and instantiated)
  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }
}
