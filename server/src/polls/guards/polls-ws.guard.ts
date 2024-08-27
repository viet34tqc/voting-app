import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsUnauthorizedException } from '../exceptions/ws-exceptions';
import { PollsService } from '../polls.service';

// This guard checks if the user is admin or not
@Injectable()
export class PollsWsGuard implements CanActivate {
  private readonly logger = new Logger(PollsWsGuard.name);
  constructor(
    private readonly pollsService: PollsService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToWs().getClient();

    // fallback to token header for postman testing
    const token =
      request.handshake.auth.token || request.handshake.headers['token'];

    if (!token) {
      this.logger.error('No authorization token provided');
      throw new WsUnauthorizedException('No authorization token provided');
    }

    try {
      const payload = this.jwtService.verify(token);
      this.logger.debug(`Validating auth token in WS: ${payload}`);
      const { sub, pollId } = payload;
      const poll = await this.pollsService.getPoll(pollId);

      if (sub !== poll.adminId) {
        throw new WsUnauthorizedException('Admin privileges required1');
      }

      return true;
    } catch (error) {
      throw new WsUnauthorizedException('Admin privileges required');
    }
  }
}
